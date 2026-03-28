import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BooksService } from 'src/books/books.service';
import { CommonService } from 'src/common/common.service';
import { DATABASE_CONNECTION } from 'src/database/database.provider';
import { getDateRange } from 'src/utils';
import { TransformLoanBookRes } from 'src/utils/transform';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { asc, sql } from 'drizzle-orm';
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';
import { RedisLock } from 'src/redis/redis-lock.decorator';

@Injectable()
export class MeiliSearchTaskService {
  private readonly logger = new Logger(MeiliSearchTaskService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    private readonly booksService: BooksService,
    private readonly meilisearchService: MeilisearchService,
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  /**
   *   cron 매월 1일
   * 1. 이전 달 인기도서 종류별 1000건수집(1만권)
   * 2. DB 저장
   * 3. MeiliSearch 저장
   * => 자동완성 검색어로 활용
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: 'bookScraper',
    timeZone: 'Asia/Seoul',
  })
  @RedisLock({ key: 'cron:bookScraper', ttlSeconds: 3600 })
  async monthStartBookScrapingJob() {
    const updatedRecords = await this.saveScrapedDataToDB().catch(() => null);
    if (!updatedRecords) return;

    await this.saveDataToMeiliSearch(updatedRecords);
  }

  async saveScrapedDataToDB() {
    const { startDate } = getDateRange();
    const BATCH_SIZE = 1000;

    //1단계: 외부 API에서 데이터 수집 (트랜잭션 밖)
    const allRecords: schema.NewBookRecord[] = [];
    for (let i = 0; i < 10; i++) {
      const result = await this.booksService.getPopularLoanBooks(1000, 1, i);
      const { records } = TransformLoanBookRes(
        result,
        i.toString(),
        startDate.slice(0, 7),
      );
      allRecords.push(...records);
    }

    //2단계: DB 저장 (트랜잭션 안 — 1000건씩 배치)
    try {
      let updatedRecords: schema.BookRecord[] = [];
      await this.db.transaction(async (tx) => {
        for (let i = 0; i < allRecords.length; i += BATCH_SIZE) {
          const batch = allRecords.slice(i, i + BATCH_SIZE);
          const inserted = await tx
            .insert(schema.books)
            .values(batch)
            .onConflictDoUpdate({
              target: schema.books.isbn,
              set: {
                loanCount: sql`${schema.books.loanCount} + excluded.loan_count`,
                baseDate: sql`(SELECT array_agg(DISTINCT val ORDER BY val) FROM unnest(${schema.books.baseDate} || excluded.base_date) AS val)`,
              },
            })
            .returning();
          updatedRecords = updatedRecords.concat(inserted);
        }
      });
      this.logger.log(`saveScrapedDataToDB success`);
      return updatedRecords;
    } catch (error: any) {
      this.logger.error(error.message);
      await this.commonService.sendMessageToDiscord(
        'saveScrapedDataToDB error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('saveScrapedDataToDB error');
    }
  }

  async saveDataToMeiliSearch(records: schema.BookRecord[]) {
    const INDEX_NAME = 'books';
    try {
      await this.meilisearchService.addBooksDocuments(records, INDEX_NAME);

      this.logger.log(`saveDataToMeiliSearch success`);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      await this.commonService.sendMessageToDiscord(
        'saveDataToMeiliSearch error',
        JSON.stringify(error),
        'Error',
      );
    }
  }
}
