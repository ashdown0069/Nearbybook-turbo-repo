import { Controller, Get, Post } from '@nestjs/common';
import { GovLibraryBigDataTaskService } from './GovLibraryBigdataTask.service';
import { MeiliSearchTaskService } from './MeiliSearchTask.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly govLibraryBigDataTaskService: GovLibraryBigDataTaskService,
    private readonly meiliSearchTaskService: MeiliSearchTaskService,
  ) {}

  // 도서관 정보 최신화 크론잡 테스트 용
  // @Get('trigger/library-refresh')
  // triggerLibraryRefresh() {
  //   console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  //   if (process.env.NODE_ENV === 'production') {
  //     return { message: '운영 환경에서는 수동 트리거가 허용되지 않습니다.' };
  //   }
  //   void this.govLibraryBigDataTaskService.refreshLibraries();
  //   return { message: '도서관 정보 최신화 시작됨' };
  // }

  // // 도서 스크래핑 + MeiliSearch 동기화 크론잡 테스트 용
  // @Get('trigger/book-scraper')
  // triggerBookScraper() {
  //   console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  //   if (process.env.NODE_ENV === 'production') {
  //     return { message: '운영 환경에서는 수동 트리거가 허용되지 않습니다.' };
  //   }
  //   void this.meiliSearchTaskService.monthStartBookScrapingJob();
  //   return { message: '도서 스크래핑 시작됨' };
  // }
}
