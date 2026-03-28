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
    await this.enqueuePopularityFlush().catch((error) => {
      this.logger.error(
        'Failed to enqueue popularity flush job on module init',
        error,
      );
    });
  }

  async enqueuePopularityFlush() {
    await this.popQueue.upsertJobScheduler('flush-job', {
      pattern: CronExpression.EVERY_2_HOURS,
    });
  }
}
