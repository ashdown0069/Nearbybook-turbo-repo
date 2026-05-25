import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common"
import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { and, eq, sql } from "drizzle-orm"
import { DATABASE_CONNECTION } from "src/database/database.provider"
import * as schema from "src/database/schema"

// API 응답에서 넘어오는 도서관 데이터 형태
// 공공 도서관 빅데이터 API는 모든 필드를 문자열로 반환
export type LibraryApiData = Record<string, string>

@Injectable()
export class LibrariesDbService {
  private readonly logger = new Logger(LibrariesDbService.name)
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async upsertLibrary(
    lib: LibraryApiData,
    regionCode: string,
    dtlRegionCode: string | null
  ): Promise<void> {
    this.logger.log(`단일 도서관 정보 저장/업데이트 시작: libCode=${lib.libCode}`);
    await this.db
      .insert(schema.libraries)
      .values({
        libCode: lib.libCode,
        libName: lib.libName,
        address: lib.address ?? "",
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
        target: schema.libraries.libCode,
        set: {
          libName: lib.libName,
          address: lib.address ?? "",
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
      })
    this.logger.log(`단일 도서관 정보 저장 완료: ${lib.libName}`);
  }

  async upsertLibraries(
    libs: LibraryApiData[],
    regionCode: string,
    dtlRegionCode: string
  ): Promise<void> {
    if (libs.length === 0) return
    this.logger.log(
      `대량 도서관 정보 저장 시작: ${libs.length}건 (regionCode=${regionCode}, dtlRegionCode=${dtlRegionCode})`
    )

    await this.db
      .insert(schema.libraries)
      .values(
        libs.map((lib) => ({
          libCode: lib.libCode,
          libName: lib.libName,
          address: lib.address ?? "",
          tel: lib.tel,
          fax: lib.fax,
          latitude: lib.latitude,
          longitude: lib.longitude,
          homepage: lib.homepage,
          closed: lib.closed,
          operatingTime: lib.operatingTime,
          regionCode,
          dtlRegionCode,
        }))
      )
      .onConflictDoUpdate({
        target: schema.libraries.libCode,
        set: {
          libName: sql`excluded.lib_name`,
          address: sql`excluded.address`,
          tel: sql`excluded.tel`,
          fax: sql`excluded.fax`,
          latitude: sql`excluded.latitude`,
          longitude: sql`excluded.longitude`,
          homepage: sql`excluded.homepage`,
          closed: sql`excluded.closed`,
          operatingTime: sql`excluded.operating_time`,
          regionCode: sql`excluded.region_code`,
          dtlRegionCode: sql`excluded.dtl_region_code`,
        },
      })
    this.logger.log(`대량 도서관 정보 저장 완료: ${libs.length}건 처리됨`)
  }

  async findByRegionCode(region: string, dtlRegion?: string) {
    this.logger.log(`DB에서 지역 기반 도서관 조회: region=${region}, dtlRegion=${dtlRegion}`);
    try {
      const result = await this.db
        .select()
        .from(schema.libraries)
        .where(
          and(
            eq(schema.libraries.regionCode, region),
            dtlRegion
              ? eq(schema.libraries.dtlRegionCode, dtlRegion)
              : undefined
          )
        )
      this.logger.log(`DB 조회 성공: ${result.length}건의 도서관 발견`);
      return result
    } catch (error) {
      this.logger.error(`findByRegionCode Error (region=${region})`, error)
      throw new InternalServerErrorException(
        "DB에서 도서관 데이터를 가져오는 데 실패했습니다"
      )
    }
  }

  async findByLibCode(libCode: string) {
    this.logger.log(`DB에서 도서관 코드 조회: libCode=${libCode}`);
    try {
      const result = await this.db
        .select()
        .from(schema.libraries)
        .where(eq(schema.libraries.libCode, libCode))
        .limit(1)

      const found = result[0] || null
      if (found) {
        this.logger.log(`DB 도서관 코드 조회 성공: ${found.libName}`);
      } else {
        this.logger.warn(`DB 도서관 코드 조회 결과 없음: libCode=${libCode}`);
      }
      return found
    } catch (error) {
      this.logger.error(`findByLibCode Error (libCode=${libCode})`, error)
      throw new InternalServerErrorException(
        "DB에서 도서관 데이터를 가져오는 데 실패했습니다"
      )
    }
  }
}
