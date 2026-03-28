import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  SI_DO_CODE_AND_NAME,
  DISTRICTS_CODE_AND_NAME,
} from 'src/constant/region-codes';
import { LibrariesService } from 'src/libraries/libraries.service';
import { LibrariesDbService } from 'src/libraries/libraries-db.service';
import { CommonService } from 'src/common/common.service';
import { RedisLock } from 'src/redis/redis-lock.decorator';

@Injectable()
export class GovLibraryBigDataTaskService {
  private readonly logger = new Logger(GovLibraryBigDataTaskService.name);

  constructor(
    private readonly librariesService: LibrariesService,
    private readonly librariesDbService: LibrariesDbService,
    private readonly commonService: CommonService,
  ) {}

  // 2개월 주기
  @Cron(CronExpression.EVERY_2ND_MONTH, {
    name: 'libraryRefresh',
    timeZone: 'Asia/Seoul',
  })
  @RedisLock({ key: 'cron:libraryRefresh', ttlSeconds: 3600 })
  async refreshLibraries() {
    this.logger.log('도서관 정보 최신화 시작...');

    try {
      // regions/detailRegions는 scraper-libs.ts(수동 초기 적재)가 담당
      // 크론잡은 libraries 최신화만 처리
      const total = await this.upsertLibraries();

      this.logger.log(`✅ 도서관 정보 최신화 완료 (${total}건)`);
      await this.commonService.sendMessageToDiscord(
        '도서관 정보 최신화 완료',
        `총 ${total}건 처리`,
        'Feedback',
      );
    } catch (error) {
      this.logger.error('❌ 도서관 정보 최신화 실패', error);
      await this.commonService.sendMessageToDiscord(
        '도서관 정보 최신화 실패',
        JSON.stringify(error),
        'Error',
      );
    }
  }

  private static readonly PARALLEL_CHUNK_SIZE = 5;

  private async upsertLibraries(): Promise<number> {
    let total = 0;

    for (const { code: regionCode, name: cityName } of SI_DO_CODE_AND_NAME) {
      const districts = DISTRICTS_CODE_AND_NAME[cityName] ?? [];

      for (
        let i = 0;
        i < districts.length;
        i += GovLibraryBigDataTaskService.PARALLEL_CHUNK_SIZE
      ) {
        const chunk = districts.slice(
          i,
          i + GovLibraryBigDataTaskService.PARALLEL_CHUNK_SIZE,
        );

        const results = await Promise.allSettled(
          chunk.map(({ code: dtlCode }) =>
            this.librariesService.fetchRegionLibraryList(
              Number(regionCode),
              Number(dtlCode),
            ),
          ),
        );

        for (let j = 0; j < chunk.length; j++) {
          const { code: dtlCode, name: dtlName } = chunk[j];
          const result = results[j];

          if (result.status === 'rejected') {
            this.logger.warn(`[${dtlCode}] ${dtlName} 조회 실패 - 건너뜀`);
            this.logger.error(`[${dtlCode}] 실패 원인`, result.reason);
            continue;
          }

          const libs = result.value as any[];
          if (libs.length === 0) continue;

          try {
            await this.librariesDbService.upsertLibraries(
              libs,
              regionCode,
              dtlCode,
            );
            total += libs.length;
            this.logger.log(
              `${cityName} ${dtlName} ${libs.length}건 저장완료`,
            );
          } catch (error) {
            this.logger.error(
              `[${dtlCode}] ${dtlName} DB 저장 실패`,
              (error as any)?.cause ?? error,
            );
          }
        }
      }
    }

    return total;
  }
}
