import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LibSrchResponse } from '@repo/types';
import { lastValueFrom } from 'rxjs';
import { CommonService } from 'src/common/common.service';
import { DATABASE_CONNECTION } from 'src/database/database.provider';
import { RedisCache } from 'src/redis/redis-cache.decorator';
import { LibrariesDbService } from './libraries-db.service';

@Injectable()
export class LibrariesService {
  private readonly logger = new Logger(LibrariesService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    private readonly LibrariesDbService: LibrariesDbService,
  ) {}

  @RedisCache({ ttl: 3600 })
  async fetchLibrariesByISBN(
    ISBN: string,
    region: number,
    detailRegion: number,
  ) {
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

      if (response.data.response.libs.length > 0) {
        return response.data.response.libs.map((lib) => lib.lib);
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error('getLibraryListByISBN service error', error);
      await this.commonService.sendMessageToDiscord(
        'getLibraryListByISBN service error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('can not get library list');
    }
  }

  async getRegionLibraryList(region: number, dtlRegion?: number) {
    return await this.LibrariesDbService.findByRegionCode(region.toString());
  }

  async fetchRegionLibraryList(
    region: number,
    dtlRegion?: number,
  ): Promise<LibSrchResponse['libs']['lib'] | []> {
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

      // return result.data;
      return result.data.response.libs.map((lib) => lib.lib);
    } catch (error) {
      this.logger.error('fetchRegionLibraryList service error', error);
      await this.commonService.sendMessageToDiscord(
        'fetchRegionLibraryList service error',
        JSON.stringify(error),
        'Error',
      );
      // throw new InternalServerErrorException('can not get library list');
      return [];
    }
  }

  async findLibrariesByISBN__Web(
    ISBN: string,
    region: number,
    dtlRegion: number,
  ) {
    const libsWithBookPromise = this.fetchLibrariesByISBN(
      ISBN,
      region,
      dtlRegion,
    );

    const regionLibsPromise = this.fetchRegionLibraryList(region, dtlRegion);

    const [libsWithBook, regionLibs] = await Promise.all([
      libsWithBookPromise,
      regionLibsPromise,
    ]);

    const bookLibCodes = new Set(
      libsWithBook.map((l: any) => l.libCode),
    );
    const result = regionLibs.map((lib: any) => ({
      hasBook: bookLibCodes.has(lib.libCode),
      ...lib,
    }));

    return result;
  }
}
