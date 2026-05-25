import { Inject, Injectable, Logger } from "@nestjs/common"
import { MEILISEARCH_ADMIN_CLIENT } from "./meilisearch.contant"
import { type Meilisearch } from "meilisearch"
import { type BookRecord } from "src/database/schema"

@Injectable()
export class MeilisearchService {
  private readonly logger = new Logger(MeilisearchService.name)
  constructor(
    @Inject(MEILISEARCH_ADMIN_CLIENT)
    private readonly meiliSearch: Meilisearch
  ) {}

  async healthCheck() {
    const res = await this.meiliSearch.health()
    return res
  }

  async addBooksDocuments(records: BookRecord[], indexName: string) {
    if (records.length === 0) return
    this.logger.log(`Meilisearch 문서 추가 시작: ${records.length}건, 인덱스=${indexName}`);
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
    }))
    try {
      await this.meiliSearch.index(indexName).addDocuments(docs)
      this.logger.log(`Meilisearch 문서 추가 완료: ${records.length}건이 ${indexName} 인덱스에 추가됨`)
    } catch (error) {
      this.logger.error(`Meilisearch 문서 추가 중 오류 발생: 인덱스=${indexName}`, error)
      throw error
    }
  }
}
