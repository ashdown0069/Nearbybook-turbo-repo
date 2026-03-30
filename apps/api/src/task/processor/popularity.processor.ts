import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import Redis from 'ioredis';
import { QUEUE_NAMES, REDIS_CLIENT } from 'src/constant/tokens';
import { DATABASE_CONNECTION } from 'src/database/database.provider';
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';
import * as schema from 'src/database/schema';
import { type NewBookRecord } from 'src/database/schema';
import { REDIS_KEYS } from 'src/constant/tokens';

@Processor(QUEUE_NAMES.POPULARITY)
export class PopularityProcessor extends WorkerHost {
  private readonly logger = new Logger(PopularityProcessor.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly meilisearchService: MeilisearchService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    /**
     * Race condition 방지
     * 읽기 - 작업 - 삭제 사이에 다른 요청이 들어올 경우
     * 데이터가 유실될 수 있으므로 rename으로 처리할 키를 변경하여 작업 수행
     */
    try {
      await this.redis.rename(
        REDIS_KEYS.POPULARITY_COUNT,
        REDIS_KEYS.POPULARITY_COUNT_PROCESSING,
      );
      await this.redis.rename(
        REDIS_KEYS.POPULARITY_META,
        REDIS_KEYS.POPULARITY_META_PROCESSING,
      );
    } catch (error) {
      this.logger.warn('popularity processor: no data to process', error);
      return;
    }

    const popularityData = await this.redis.hgetall(
      REDIS_KEYS.POPULARITY_COUNT_PROCESSING,
    );
    const metaData = await this.redis.hgetall(
      REDIS_KEYS.POPULARITY_META_PROCESSING,
    );

    const isbns = Object.keys(popularityData);
    if (isbns.length === 0) {
      await this.cleanupProcessingKeys();
      return;
    }

    /**
     * metaData(책 정보) + popularityData(조회수)를 결합하여 DB insert용 레코드 생성
     * metaData는 _trackingBook에서 저장한 searchBook 결과 (data4library 또는 Naver API 형식)
     */
    const records: NewBookRecord[] = [];
    for (const isbn of isbns) {
      const count = Number(popularityData[isbn]) || 0;
      const raw = metaData[isbn];
      if (!raw) continue;

      let meta = null;
      try {
        meta = JSON.parse(raw);
      } catch (error) {
        this.logger.error(
          `popularity processor: invalid meta for ISBN ${isbn}`,
          error,
        );
        continue;
      }
      const title = (meta.bookname ?? '').trim();
      if (!title) continue;

      records.push({
        title,
        authors: meta.authors?.trim() || null,
        publisher: meta.publisher?.trim() || null,
        publicationYear:
          (meta.publication_year ?? meta.publication_date ?? '')
            .trim()
            .slice(0, 4) || null,
        isbn,
        vol: meta.vol?.trim() || null,
        bookImageURL: meta.bookImageURL?.trim() || null,
        popularity: count,
      });
    }

    if (records.length === 0) {
      await this.cleanupProcessingKeys();
      return;
    }

    /**
     * DB upsert + returning
     * - 새 도서 → insert
     * - 기존 도서 → popularity 누적합
     * - returning()으로 최종 상태의 BookRecord[] 반환 (DB 재조회 불필요)
     */
    try {
      const upsertedBooks = await this.db
        .insert(schema.books)
        .values(records)
        .onConflictDoUpdate({
          target: schema.books.isbn,
          set: {
            popularity: sql`${schema.books.popularity} + excluded.popularity`,
          },
        })
        .returning();

      this.logger.log(`${upsertedBooks.length} books popularity updated in DB`);

      /**
       * MeiliSearch 동기화
       * returning()의 결과(BookRecord[])를 그대로 전달
       * addDocuments는 primary key(isbn) 기준 upsert이므로 기존 문서 자동 갱신
       */
      await this.meilisearchService.addBooksDocuments(upsertedBooks, 'books');
      this.logger.log(`${upsertedBooks.length} books synced to MeiliSearch`);
    } catch (error) {
      this.logger.error('popularity processor error', error);
    }

    await this.cleanupProcessingKeys();
  }

  private async cleanupProcessingKeys() {
    await this.redis.del(REDIS_KEYS.POPULARITY_COUNT_PROCESSING);
    await this.redis.del(REDIS_KEYS.POPULARITY_META_PROCESSING);
  }
}
