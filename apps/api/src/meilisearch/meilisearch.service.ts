import { Inject, Injectable, Logger } from '@nestjs/common';
import { MEILISEARCH_ADMIN_CLIENT } from './meilisearch.contant';
import { type Meilisearch } from 'meilisearch';
import { type BookRecord } from 'src/database/schema';

@Injectable()
export class MeilisearchService {
  private readonly logger = new Logger(MeilisearchService.name);
  constructor(
    @Inject(MEILISEARCH_ADMIN_CLIENT)
    private readonly meiliSearch: Meilisearch,
  ) {}

  async healthCheck() {
    const res = await this.meiliSearch.health();
    return res;
  }

  async addBooksDocuments(records: BookRecord[], indexName: string) {
    if (records.length === 0) return;
    const docs = records.map((r) => ({
      id: r.isbn,
      title: r.title,
      authors: r.authors,
      publisher: r.publisher,
      publicationYear: r.publicationYear,
      isbn: r.isbn,
      vol: r.vol,
      loanCount: r.loanCount,
      popularity: r.popularity,
      kdc: r.kdc,
      bookImageURL: r.bookImageURL,
    }));
    try {
      await this.meiliSearch.index(indexName).addDocuments(docs);
      this.logger.log(
        `${records.length} documents added to ${indexName} index`,
      );
    } catch (error) {
      this.logger.error(`addDocuments error ${indexName} index`, error);
      throw error;
    }
  }
}
