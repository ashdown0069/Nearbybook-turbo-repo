import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/database/database.provider';
import * as schema from 'src/database/schema';

// API 응답에서 넘어오는 도서관 데이터 형태
// 공공 도서관 빅데이터 API는 모든 필드를 문자열로 반환
export type LibraryApiData = Record<string, string>;

@Injectable()
export class LibrariesDbService {
  private readonly logger = new Logger(LibrariesDbService.name);
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async upsertLibrary(
    lib: LibraryApiData,
    regionCode: string,
    dtlRegionCode: string | null,
  ): Promise<void> {
    await this.db
      .insert(schema.libraries)
      .values({
        libCode: lib.libCode,
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
      })
      .onConflictDoUpdate({
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

  async upsertLibraries(
    libs: LibraryApiData[],
    regionCode: string,
    dtlRegionCode: string,
  ): Promise<void> {
    if (libs.length === 0) return;

    await this.db
      .insert(schema.libraries)
      .values(
        libs.map((lib) => ({
          libCode: lib.libCode,
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
        })),
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
      });
  }

  async findByRegionCode(region: string, dtlRegion?: string) {
    try {
      return await this.db
        .select()
        .from(schema.libraries)
        .where(
          and(
            eq(schema.libraries.regionCode, region),
            dtlRegion
              ? eq(schema.libraries.dtlRegionCode, dtlRegion)
              : undefined,
          ),
        );
    } catch (error) {
      this.logger.error('findByRegionCode Error', error);
      throw new InternalServerErrorException(
        'DB에서 도서관 데이터를 가져오는 데 실패했습니다',
      );
    }
  }
}
