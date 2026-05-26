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
import * as schema from 'src/database/schema';
import { asc, sql } from 'drizzle-orm';
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';
import { RedisLock } from 'src/redis/redis-lock.decorator';

@Injectable()
export class MeiliSearchTaskService {
  private readonly logger = new Logger(MeiliSearchTaskService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly booksService: BooksService,
    private readonly meilisearchService: MeilisearchService,
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly commonService: CommonService,
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
    if (process.env.NODE_ENV === 'development') {
      this.logger.warn('개발 환경에서는 작업을 건너뜁니다.');
      return;
    }

    try {
      this.logger.log('월간 도서 스크래핑 및 검색 엔진 동기화 시작...');
      const updatedRecords = await this.saveScrapedDataToDB().catch(() => null);
      if (!updatedRecords) {
        this.logger.warn('DB 저장 결과가 없어 작업을 중단합니다.');
        return;
      }

      await this.saveDataToMeiliSearch(updatedRecords);
      this.logger.log('월간 도서 스크래핑 및 검색 엔진 동기화 완료');
    } catch (error) {
      this.logger.error('❌ 월간 도서 스크래핑 크론잡 전체 실패', error);

      const errorMsg = error instanceof Error ? error.message : String(error);
      await this.commonService
        .sendMessageToDiscord(
          '🚨 [CRON] 월간 도서 스크래핑 실패',
          `검색 엔진 동기화 작업 중 오류가 발생했습니다.\n**[Error]** ${errorMsg}`,
          'Error',
        )
        .catch((e) => this.logger.error('Discord 알림 전송 실패', e));
    }
  }

  async saveScrapedDataToDB() {
    const { startDate } = getDateRange();
    const BATCH_SIZE = 1000;
    this.logger.log(`데이터 스크래핑 및 DB 저장 시작 (기준일: ${startDate})`);

    //1단계: 외부 API에서 데이터 수집 (트랜잭션 밖)
    const allRecords: schema.NewBookRecord[] = [];
    for (let i = 0; i < 10; i++) {
      this.logger.log(`KDC ${i}00번대 인기도서 수집 중...`);
      const result = await this.booksService.getPopularLoanBooks(1000, 1, i);
      const { records } = TransformLoanBookRes(
        result,
        i.toString(),
        startDate.slice(0, 7),
      );
      allRecords.push(...records);
    }
    this.logger.log(
      `총 ${allRecords.length}건의 데이터 수집 완료. DB 반영 시작...`,
    );

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
          this.logger.log(
            `DB 배치 저장 진행 중... (${updatedRecords.length}/${allRecords.length})`,
          );
        }
      });
      this.logger.log(`DB 저장 성공: 총 ${updatedRecords.length}건 반영됨`);
      return updatedRecords;
    } catch (error: any) {
      this.logger.error(`DB 저장 중 오류 발생: ${error.message}`, error);
      throw new InternalServerErrorException('saveScrapedDataToDB error');
    }
  }

  async saveDataToMeiliSearch(records: schema.BookRecord[]) {
    const INDEX_NAME = 'books';
    this.logger.log(`MeiliSearch 데이터 동기화 시작: ${records.length}건`);
    try {
      await this.meilisearchService.addBooksDocuments(records, INDEX_NAME);

      this.logger.log(`MeiliSearch 데이터 동기화 완료: ${INDEX_NAME}`);
    } catch (error) {
      this.logger.error(
        `MeiliSearch 동기화 오류: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
    }
  }
}
