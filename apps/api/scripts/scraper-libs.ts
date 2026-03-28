/**
 * scraper-libs.ts
 * 공공 도서관 정보 전체 수집 배치 스크립트
 *
 * 왜 3단계로 나누어 처리하는가:
 *  - regions, detailRegions 테이블은 libraries 테이블의 FK 참조 대상
 *  - 따라서 libraries 삽입 전에 두 참조 테이블이 먼저 채워져야 FK 제약 위반을 방지
 *
 * 왜 SI_DO_CODE_AND_NAME을 사용하는가:
 *  - SI_DO_CODE_AND_NAME의 name 필드('서울특별시' 등)가
 *    DISTRICTS_CODE_AND_NAME의 키와 정확히 일치하므로 직접 조회 가능
 *  - regionCodes는 단순 코드→약칭 매핑으로 지역 전체명을 포함하지 않음
 *
 * 왜 구/군 단위로 API를 호출하는가:
 *  - 도서관 API 응답에는 dtlRegionCode가 포함되지 않음
 *  - dtl_region 파라미터로 조회하면, 반환된 도서관들이 해당 구/군 소속임을 보장
 *  - 덕분에 dtlRegionCode를 쿼리 파라미터 값으로 정확히 설정 가능
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { LibrariesService } from 'src/libraries/libraries.service';
import {
  SI_DO_CODE_AND_NAME,
  DISTRICTS_CODE_AND_NAME,
} from '../src/constant/region-codes';
import * as schema from 'src/database/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { closeConnection, getDb } from './connection';
import { ConfigService } from '@nestjs/config';

async function upsertLibrary(
  db: NodePgDatabase<typeof schema>,
  lib: Record<string, string>,
  regionCode: string,
  dtlRegionCode: string | null,
) {
  await db
    .insert(schema.libraries)
    .values({
      libCode: lib.libCode,
      libName: lib.libName,
      // address가 notNull이므로 API가 빈 값을 반환하는 경우 빈 문자열로 대체
      address: lib.address ?? '',
      tel: lib.tel,
      fax: lib.fax,
      latitude: lib.latitude,
      longitude: lib.longitude,
      homepage: lib.homepage,
      closed: lib.closed,
      operatingTime: lib.operatingTime,
      regionCode,
      dtlRegionCode,
    })
    .onConflictDoUpdate({
      // libCode.unique() 덕분에 이미 존재하면 전체 필드 갱신
      target: schema.libraries.libCode,
      set: {
        libName: lib.libName,
        address: lib.address ?? '',
        tel: lib.tel,
        fax: lib.fax,
        latitude: lib.latitude,
        longitude: lib.longitude,
        homepage: lib.homepage,
        closed: lib.closed,
        operatingTime: lib.operatingTime,
        regionCode,
        dtlRegionCode,
      },
    });
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  const librariesService = app.get(LibrariesService);
  const db = getDb(config.get('DATABASE_URL'));

  try {
    // ─── 1단계: regions 테이블 채우기 ──────────────────────────────────────
    // SI_DO_CODE_AND_NAME: [{ name: '서울특별시', code: '11' }, ...]
    // regions.code에 unique 제약이 있으므로 중복 실행 시에도 안전하게 upsert
    console.log('📍 1단계: 광역 지역 코드 삽입 중...');
    for (const { code, name } of SI_DO_CODE_AND_NAME) {
      await db
        .insert(schema.regions)
        .values({ code, name })
        .onConflictDoUpdate({
          target: schema.regions.code,
          set: { name },
        });
    }
    console.log(`   ✓ ${SI_DO_CODE_AND_NAME.length}개 광역 지역 완료`);

    // ─── 2단계: detailRegions 테이블 채우기 ───────────────────────────────
    // DISTRICTS_CODE_AND_NAME: { '서울특별시': [{ name, code, adjacency }] }
    // SI_DO_CODE_AND_NAME.name으로 regionCode를 찾아 FK 관계 설정
    // adjacency(인접 구역) 정보는 화면 UI용이므로 스크래퍼에서는 저장하지 않음
    console.log('📍 2단계: 세부 지역 코드 삽입 중...');
    let dtlCount = 0;
    for (const [cityName, districts] of Object.entries(
      DISTRICTS_CODE_AND_NAME,
    )) {
      const regionEntry = SI_DO_CODE_AND_NAME.find((r) => r.name === cityName);
      if (!regionEntry) {
        console.warn(
          `  ⚠ regionCode 매핑 실패: "${cityName}" (region-codes.ts 확인 필요)`,
        );
        continue;
      }
      for (const district of districts) {
        await db
          .insert(schema.detailRegions)
          .values({
            regionCode: regionEntry.code,
            dtlRegionCode: district.code,
            dtlRegionName: district.name,
            name: district.name,
          })
          .onConflictDoUpdate({
            target: schema.detailRegions.dtlRegionCode,
            set: { dtlRegionName: district.name, name: district.name },
          });
        dtlCount++;
      }
    }
    console.log(`   ✓ ${dtlCount}개 세부 지역 완료`);

    // ─── 3단계: 도서관 데이터 크롤링 & upsert ──────────────────────────────
    // 왜 구/군 단위로 반복하는가:
    //   공공 도서관 API는 응답에 dtlRegionCode를 포함하지 않으므로
    //   dtl_region 파라미터로 조회하여 쿼리값을 그대로 dtlRegionCode로 사용
    // 예외: DISTRICTS_CODE_AND_NAME에 없는 지역(구역 미정의)은 광역 코드만으로 조회
    console.log('📚 3단계: 도서관 정보 크롤링 시작...');
    let total = 0;
    for (const { code: regionCode, name: cityName } of SI_DO_CODE_AND_NAME) {
      const districts = DISTRICTS_CODE_AND_NAME[cityName] ?? [];

      if (districts.length === 0) {
        // 세종특별자치시 등 DISTRICTS_CODE_AND_NAME 미정의 지역
        console.log(`  [${regionCode}] ${cityName} → 지역 단위 일괄 조회`);
        const libs = await librariesService.fetchRegionLibraryList(
          Number(regionCode),
        );
        for (const lib of libs) {
          await upsertLibrary(
            db,
            lib as Record<string, string>,
            regionCode,
            null,
          );
          total++;
        }
      } else {
        // 구/군 단위 개별 조회 → dtlRegionCode를 정확히 매핑
        for (const district of districts) {
          const libs = await librariesService.fetchRegionLibraryList(
            Number(regionCode),
            Number(district.code),
          );
          for (const lib of libs) {
            await upsertLibrary(
              db,
              lib as Record<string, string>,
              regionCode,
              district.code,
            );
            total++;
          }
        }
        console.log(
          `  [${regionCode}] ${cityName}: ${districts.length}개 구역, ${total}건 누적`,
        );
      }
    }

    console.log(`\n✅ 작업 완료 (총 ${total}건 처리)`);
  } catch (error) {
    console.error('❌ 작업 실패', error);
  } finally {
    await closeConnection();
    await app.close();
    process.exit(0);
  }
}

bootstrap();
