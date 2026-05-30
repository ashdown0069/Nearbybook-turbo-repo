import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LibSrchResponse } from '@workspace/types';
import { lastValueFrom } from 'rxjs';
import { RedisCache } from 'src/redis/redis-cache.decorator';
import { LibrariesDbService } from './libraries-db.service';

@Injectable()
export class LibrariesService {
  private readonly logger = new Logger(LibrariesService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly LibrariesDbService: LibrariesDbService,
  ) {}

  async fetchLibrariesByISBN(
    ISBN: string,
    region: number,
    detailRegion: number,
  ) {
    this.logger.log(
      `ISBN 기반 소장 도서관 조회 시작: ISBN=${ISBN}, region=${region}`,
    );
    try {
      const response = await lastValueFrom(
        this.httpService.get(`/libSrchByBook`, {
          params: {
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            isbn: ISBN,
            region: region,
            pageSize: 50,
            format: 'json',
            ...(detailRegion && {
              dtl_region: detailRegion,
            }),
          },
        }),
      );

      const libs = response.data.response.libs;
      if (libs && libs.length > 0) {
        this.logger.log(
          `ISBN 기반 소장 도서관 조회 성공: ${libs.length}개 도서관`,
        );
        return libs.map((lib) => lib.lib);
      } else {
        this.logger.log(`ISBN 기반 소장 도서관 결과 없음: ISBN=${ISBN}`);
        return [];
      }
    } catch (error) {
      this.logger.error(
        `ISBN 기반 소장 도서관 조회 중 오류 발생: ISBN=${ISBN}`,
        error,
      );
      throw new InternalServerErrorException('can not get library list');
    }
  }

  async getRegionLibraryList(region: number, dtlRegion?: number) {
    this.logger.log(
      `지역별 도서관 목록 조회 시작: region=${region}, dtlRegion=${dtlRegion}`,
    );
    return await this.LibrariesDbService.findByRegionCode(region.toString());
  }

  async fetchRegionLibraryList(
    region: number,
    dtlRegion?: number,
  ): Promise<LibSrchResponse['libs']['lib'] | []> {
    this.logger.log(
      `API를 통한 지역 도서관 목록 호출: region=${region}, dtlRegion=${dtlRegion}`,
    );
    let params = {};
    if (dtlRegion) {
      params = {
        region: region,
        dtl_region: dtlRegion,
      };
    } else {
      params = {
        region: region,
      };
    }
    try {
      const result = await lastValueFrom(
        this.httpService.get(`/libSrch`, {
          params: {
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            pageNo: 1,
            pageSize: 500,
            format: 'json',
            ...params,
          },
        }),
      );

      const libs = result.data.response.libs;
      this.logger.log(`지역 도서관 목록 호출 성공: ${libs?.length ?? 0}건`);
      return libs.map((lib) => lib.lib);
    } catch (error) {
      this.logger.error(
        `지역 도서관 목록 호출 중 오류 발생: region=${region}, dtlRegion=${dtlRegion}`,
        error,
      );
      throw new InternalServerErrorException('can not get library list');
    }
  }

  async findLibrariesByISBN__Web(
    ISBN: string,
    region: number,
    dtlRegion: number,
  ) {
    this.logger.log(
      `웹용 ISBN 도서관 조회 시작: ISBN=${ISBN}, region=${region}`,
    );
    const libsWithBookPromise = this.fetchLibrariesByISBN(
      ISBN,
      region,
      dtlRegion,
    );

    // 로컬 DB 우선 조회 후, 없을 시 외부 API를 싱크하는 헬퍼 메서드 호출
    const regionLibsPromise = this.getOrFetchRegionLibraryList(
      region,
      dtlRegion,
    );

    const [libsWithBook, regionLibs] = await Promise.all([
      libsWithBookPromise,
      regionLibsPromise,
    ]);

    const bookLibCodes = new Set(libsWithBook.map((l: any) => l.libCode));
    const result = regionLibs.map((lib: any) => ({
      hasBook: bookLibCodes.has(lib.libCode),
      ...lib,
    }));

    this.logger.log(
      `웹용 ISBN 도서관 조회 완료: 총 ${result.length}개 도서관 매핑`,
    );
    return result;
  }

  /**
   * 행정구역별 전체 도서관 목록을 가져올 때 로컬 DB를 우선 조회하고,
   * 없을 경우 외부 공공 API를 호출하여 DB에 저장하는 메서드
   */
  private async getOrFetchRegionLibraryList(
    region: number,
    dtlRegion?: number,
  ): Promise<any[]> {
    // 1. 로컬 데이터베이스 선조회
    const localLibs = await this.LibrariesDbService.findByRegionCode(
      region.toString(),
      dtlRegion?.toString(),
    );

    // 2. 데이터가 로컬 DB에 존재하면 즉시 반환
    if (localLibs && localLibs.length > 0) {
      this.logger.log(
        `로컬 DB에서 지역 도서관 목록 반환: region=${region}, dtlRegion=${dtlRegion}, count=${localLibs.length}건`,
      );
      return localLibs;
    }

    // 3. 로컬 DB에 데이터가 없으면 외부 API 호출
    this.logger.warn(
      `로컬 DB 캐시 미스! 외부 API로부터 동기화 시작: region=${region}, dtlRegion=${dtlRegion}`,
    );
    const externalLibs = await this.fetchRegionLibraryList(region, dtlRegion);

    if (externalLibs && externalLibs.length > 0) {
      // 4. 로컬 DB 적재는 백그라운드 비동기로 실행하여 사용자 응답 속도를 확보
      this.LibrariesDbService.upsertLibraries(
        externalLibs as any[],
        region.toString(),
        dtlRegion?.toString() || '',
      ).catch((err) => {
        this.logger.error('외부 도서관 정보 로컬 DB 적재 중 에러 발생', err);
      });
    }

    return externalLibs;
  }
}
