import { Module } from "@nestjs/common"

import { TaskController } from "./task.controller"
import { BooksModule } from "src/books/books.module"
import { MeilisearchModule } from "src/meilisearch/meilisearch.module"
import { CommonModule } from "src/common/common.module"
import { MeiliSearchTaskService } from "./MeiliSearchTask.service"
import { GovLibraryBigDataTaskService } from "./GovLibraryBigdataTask.service"
import { LibrariesModule } from "src/libraries/libraries.module"
import { TrackingTaskService } from "./TrackingTask.service"
import { PopularityProcessor } from "./processor/popularity.processor"
import { QUEUE_NAMES } from "src/constant/tokens"
import { BullModule } from "@nestjs/bullmq"

// 신규 추가 임포트
import { SearchLogTaskService } from "./SearchLogTask.service"
import { SearchLogProcessor } from "./processor/search-log.processor"

@Module({
  controllers: [TaskController],
  providers: [
    MeiliSearchTaskService,
    GovLibraryBigDataTaskService,
    TrackingTaskService,
    PopularityProcessor,
    SearchLogTaskService,   // 신규 등록
    SearchLogProcessor,     // 신규 등록
  ],
  imports: [
    BooksModule,
    MeilisearchModule,
    CommonModule,
    LibrariesModule,
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.POPULARITY,
      },
      {
        name: QUEUE_NAMES.SEARCH_LOG, // 신규 큐 등록
      }
    ),
  ],
})
export class TaskModule {}

