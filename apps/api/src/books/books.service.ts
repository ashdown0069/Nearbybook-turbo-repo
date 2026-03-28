import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { searchBooksDto } from './dto/req/search-books.dto';
import { searchBookDto } from './dto/req/search-book.dto';
import { CommonService } from 'src/common/common.service';
import { formatDate, getDateRange } from 'src/utils';
import { XMLParser } from 'fast-xml-parser';
import { RedisCache } from 'src/redis/redis-cache.decorator';
import { SrchDtlListResponse, NaverBookAdvResponse } from '@repo/types';
import { REDIS_CLIENT } from 'src/constant/tokens';
import Redis from 'ioredis';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dto/res/books.dto';

@Injectable()
export class BooksService {
  private readonly parser = new XMLParser();
  private readonly logger = new Logger(BooksService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /**
   * 책 검색으로는 검색결과가 없지만 도서 소장 도서관 검색에는
   * 도서가 검색되는 경우가 있어 Naver api로 한번 더 검색
   */
  // @RedisCache({ ttl: 3600 })
  async searchBook__naver(isbn: searchBookDto['isbn']) {
    try {
      const resultXML = await this.httpService.axiosRef.get(
        'https://openapi.naver.com/v1/search/book_adv.xml',
        {
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_SECRET,
          },
          params: {
            d_isbn: isbn,
          },
        },
      );
      //xml -> json 변환
      const BookData = this.parser.parse(
        resultXML.data,
      ) as NaverBookAdvResponse;

      if (BookData.rss.channel.total === 0) {
        return {} as any;
      }

      const item = BookData.rss.channel.item;
      const book = {
        bookname: item.title,
        authors: item.author,
        publisher: item.publisher,
        publication_year: item.pubdate.toString().slice(0, 4),
        isbn: item.isbn,
        bookImageURL: item.image,
      };
      return book;
    } catch (error) {
      this.logger.error('searchBook__naver service error', error);
      await this.commonService.sendMessageToDiscord(
        'searchBook__naver error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('searchBook__naver error');
    }
  }

  @RedisCache({ ttl: 3600 })
  async searchBook(isbn: searchBookDto['isbn']) {
    try {
      const result = await lastValueFrom(
        this.httpService.get(`/srchDtlList`, {
          params: {
            isbn13: isbn,
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            loaninfoYN: 'Y',
            displayInfo: 'age',
            format: 'json',
          },
        }),
      );

      const response = result.data?.response;
      if (!response || response.error) {
        return this.searchBook__naver(isbn);
      }

      const detail = response.detail;
      if (!Array.isArray(detail) || detail.length === 0) {
        return this.searchBook__naver(isbn);
      }

      const foundBook = detail[0]?.book;
      if (!foundBook) {
        return this.searchBook__naver(isbn);
      }

      return foundBook;
    } catch (error) {
      this.logger.error('searchBook service error', error);
      try {
        return await this.searchBook__naver(isbn);
      } catch (naverError) {
        this.logger.error('searchBook__naver fallback also failed', naverError);
        throw new InternalServerErrorException(
          '도서 정보를 가져올 수 없습니다',
        );
      }
    }
  }
  @Serialize(BookDto)
  async searchBooks(
    mode: searchBooksDto['mode'],
    query: searchBooksDto['query'],
    pageNo: searchBooksDto['pageNo'] = 1,
  ) {
    let params;
    if (mode === 'title') {
      params = {
        title: query,
      };
    } else if (mode === 'isbn') {
      params = {
        isbn13: query,
      };
    }

    try {
      const result = await firstValueFrom(
        this.httpService.get(`/srchBooks`, {
          params: {
            ...params,
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            pageSize: 12,
            sort: 'pubYear',
            order: 'desc',
            format: 'json',
            pageNo,
            exactMatch: true,
          },
        }),
      );

      const response = result.data.response;
      if (!response || !response.docs) {
        return {
          pages: 0,
          books: [],
          numFound: 0,
        };
      }

      const foundBooks = response.numFound;
      const pageSize = 12;
      const pages = Math.ceil(foundBooks / pageSize);
      const books = response.docs.map((item) => item.doc);
      const responseWithPages = {
        pages: pages,
        books: books,
        numFound: foundBooks,
      };

      return responseWithPages;
    } catch (error) {
      this.logger.error('getBooks service error', error);
      await this.commonService.sendMessageToDiscord(
        'getBooks service error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('can not get book list');
    }
  }

  async getTrendingBooks() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const currentDate = formatDate(yesterday);
      const result = await lastValueFrom(
        this.httpService.get(`/hotTrend`, {
          params: {
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            format: 'json',
            searchDt: currentDate,
          },
        }),
      );

      const results = result.data?.response?.results;
      if (!results) {
        return [];
      }

      const books = results.flatMap(
        (item) => item.result?.docs?.map((d) => d.doc) ?? [],
      );

      //중복제거, 최대 7개 선택
      const filteredBooks = [
        ...new Map(books.map((item) => [item.isbn13, item])).values(),
      ].slice(0, 7);

      return filteredBooks;
    } catch (error) {
      this.logger.error('getTrendingBooks service error', error);
      return [];
    }
  }

  async getPopularLoanBooks(
    pageSize: number = 10,
    pageNo: number = 1,
    kdc?: number,
  ) {
    const { startDate, endDate } = getDateRange();

    try {
      const result = await lastValueFrom(
        this.httpService.get(`/loanItemSrch`, {
          params: {
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            startDt: startDate,
            endDt: endDate,
            format: 'json',
            pageNo,
            pageSize,
            ...(kdc !== undefined && { kdc }),
          },
        }),
      );
      const docs = result.data?.response?.docs;
      if (!docs) {
        return [];
      }

      return docs.map((item) => item.doc);
    } catch (error) {
      this.logger.error('getPopularLoanBooks service error', error);
      await this.commonService.sendMessageToDiscord(
        'getPopularLoanBooks service error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('can not get PopularLoanBooks');
    }
  }

  async getBookLoanStatus(isbn: string, libCode: number) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`/bookExist`, {
          params: {
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            isbn13: isbn,
            libCode: libCode,
            format: 'json',
          },
        }),
      );
      return response.data.response.result;
    } catch (error) {
      this.logger.error('getBookLoanStatus service error', error);
      await this.commonService.sendMessageToDiscord(
        'getBookLoanStatus service error',
        JSON.stringify(error),
        'Error',
      );
      throw new InternalServerErrorException('can not get loan status');
    }
  }

  async getAutocompleteSuggestions(query: string, mode?: 'title' | 'isbn') {
    try {
      const body: Record<string, unknown> = {
        q: query,
        limit: 15,
      };

      // if (mode) {
      //   body.attributesToSearchOn = [mode];
      // }

      const result = await this.httpService.axiosRef.post(
        `${process.env.MEILISEARCH_HOST}/indexes/books/search`,
        body,
        {
          headers: {
            Authorization: `Bearer ${process.env.MEILISEARCH_SEARCH_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        hits: result.data.hits,
        query: result.data.query,
        processingTimeMs: result.data.processingTimeMs,
      };
    } catch (error) {
      this.logger.error('getAutocompleteSuggestions error', error);
      throw new InternalServerErrorException('autocomplete search failed');
    }
  }

  async _trackingBook(isbn: string) {
    const book = await this.searchBook(isbn);
    if (Object.keys(book).length === 0) {
      this.logger.warn(`trackingBook: Book not found for ISBN ${isbn}`);
      return;
    }
    try {
      await this.redis.hincrby('popularity:count', isbn, 1);
      await this.redis.hsetnx('popularity:meta', isbn, JSON.stringify(book));
    } catch (error) {
      this.logger.error('trackBook error', error);
      throw new InternalServerErrorException('track book failed');
    }
  }
}
