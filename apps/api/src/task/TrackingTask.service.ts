import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/constant/tokens';
import { Queue } from 'bullmq';

@Injectable()
export class TrackingTaskService implements OnModuleInit {
  private readonly logger = new Logger(TrackingTaskService.name);
  constructor(@InjectQueue(QUEUE_NAMES.POPULARITY) private popQueue: Queue) {}

  async onModuleInit() {
    // 인기 도서 집계 작업은 단일 스레드로 실행되어야 하므로 글로벌 동시성 1로 설정
    await this.popQueue.setGlobalConcurrency(1);
    await this.enqueuePopularityFlush().catch((error) => {
      this.logger.error(
        'Failed to enqueue popularity flush job on module init',
        error,
      );
    });
  }

  async enqueuePopularityFlush() {
    if (process.env.NODE_ENV === 'development') {
      this.logger.warn('개발 환경에서는 작업을 건너뜁니다.');
      return;
    }
    await this.popQueue.upsertJobScheduler('flush-job', {
      pattern: CronExpression.EVERY_2_HOURS,
    });
  }
}
