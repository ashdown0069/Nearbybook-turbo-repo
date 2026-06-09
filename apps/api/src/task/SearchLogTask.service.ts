import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/constant/tokens';
import { Queue } from 'bullmq';

@Injectable()
export class SearchLogTaskService implements OnModuleInit {
  private readonly logger = new Logger(SearchLogTaskService.name);
  constructor(
    @InjectQueue(QUEUE_NAMES.SEARCH_LOG) private searchLogQueue: Queue,
  ) {}

  async onModuleInit() {
    // 동시 실행을 방지하기 위해 글로벌 동시성 1 설정
    await this.searchLogQueue.setGlobalConcurrency(1);
    await this.enqueueSearchLogFlush().catch((error) => {
      this.logger.error(
        'Failed to enqueue search log flush job on module init',
        error,
      );
    });
  }

  async enqueueSearchLogFlush() {
    if (process.env.NODE_ENV === 'development') {
      this.logger.warn('개발 환경에서는 검색 로그 이관 작업을 건너뜁니다.');
      return;
    }
    this.logger.log('검색 로그 이관 스케줄러 등록 시작...');
    await this.searchLogQueue.upsertJobScheduler('flush-search-logs-job', {
      pattern: CronExpression.EVERY_6_HOURS,
    });
    this.logger.log('검색 로그 이관 스케줄러 등록 완료 (30분 주기)');
  }
}
