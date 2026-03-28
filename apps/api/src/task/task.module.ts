import { Module } from '@nestjs/common';

import { TaskController } from './task.controller';
import { BooksModule } from 'src/books/books.module';
import { MeilisearchModule } from 'src/meilisearch/meilisearch.module';
import { CommonModule } from 'src/common/common.module';
import { MeiliSearchTaskService } from './MeiliSearchTask.service';
import { GovLibraryBigDataTaskService } from './GovLibraryBigdataTask.service';
import { LibrariesModule } from 'src/libraries/libraries.module';
import { TrackingTaskService } from './TrackingTask.service';
import { PopularityProcessor } from './processor/popularity.processor';
import { QUEUE_NAMES } from 'src/constant/tokens';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [TaskController],
  providers: [
    MeiliSearchTaskService,
    GovLibraryBigDataTaskService,
    TrackingTaskService,
    PopularityProcessor,
  ],
  imports: [
    BooksModule,
    MeilisearchModule,
    CommonModule,
    LibrariesModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.POPULARITY,
    }),
  ],
})
export class TaskModule {}
