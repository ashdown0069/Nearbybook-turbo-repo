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
import { formatDate, getDateRange } from 'src/utils';
import { XMLParser } from 'fast-xml-parser';
import { RedisCache } from 'src/redis/redis-cache.decorator';
import {
  NaverBookAdvResponse,
  ItemSrchResponse,
  BookExistResponse,
} from '@workspace/types';
import { REDIS_CLIENT, REDIS_KEYS } from 'src/constant/tokens';
import Redis from 'ioredis';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dto/res/books.dto';
import { BookRecord } from 'src/database/schema';
import { SearchBookLocationDto } from './dto/req/search-book-location.dto';

@Injectable()
export class BooksService {
  private readonly parser = new XMLParser();
  private readonly logger = new Logger(BooksService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /**
   * 책 검색으로는 검색결과가 없지만 도서 소장 도서관 검색에는
   * 도서가 검색되는 경우가 있어 Naver api로 한번 더 검색
   */
  @RedisCache({ ttl: 3600 })
  async searchBook__naver(isbn: searchBookDto['isbn']) {
    this.logger.log(`Naver API를 통한 도서 상세 조회 시작: ISBN=${isbn}`);
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
        this.logger.warn(`Naver API 조회 결과 없음: ISBN=${isbn}`);
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
      this.logger.log(`Naver API 조회 성공: ${book.bookname}`);
      return book;
    } catch (error) {
      this.logger.error(`Naver API 조회 중 오류 발생: ISBN=${isbn}`, error);
      throw new InternalServerErrorException('searchBook__naver error');
    }
  }

  // @RedisCache({ ttl: 3600 })
  async searchBook(isbn: searchBookDto['isbn']) {
    this.logger.log(`도서 상세 조회 시작: ISBN=${isbn}`);
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
        this.logger.warn(
          `도서관 빅데이터 API 조회 실패, Naver API로 전환: ISBN=${isbn}`,
        );
        return this.searchBook__naver(isbn);
      }

      const detail = response.detail;
      if (!Array.isArray(detail) || detail.length === 0) {
        this.logger.warn(
          `도서관 빅데이터 API 결과 없음, Naver API로 전환: ISBN=${isbn}`,
        );
        return await this.searchBook__naver(isbn);
      }

      const foundBook = detail[0]?.book;
      if (!foundBook) {
        this.logger.warn(
          `도서관 빅데이터 API 북 데이터 없음, Naver API로 전환: ISBN=${isbn}`,
        );
        return await this.searchBook__naver(isbn);
      }
      this.logger.log(`도서 상세 조회 성공: ${foundBook.bookname}`);
      return foundBook;
    } catch (error) {
      this.logger.error(
        `도서 상세 조회 중 오류 발생, Naver API 시도: ISBN=${isbn}`,
        error,
      );
      try {
        return await this.searchBook__naver(isbn);
      } catch (naverError) {
        this.logger.error(`도서 상세 조회 최종 실패: ISBN=${isbn}`, naverError);
        throw new InternalServerErrorException(
          '도서 정보를 가져올 수 없습니다',
        );
      }
    }
  }

  async searchBookLocation(
    libCode: SearchBookLocationDto['libCode'],
    isbn: SearchBookLocationDto['isbn'],
    pageNo: SearchBookLocationDto['pageNo'] = 1,
  ) {
    this.logger.log(
      `도서 소장 위치 조회 시작: libCode=${libCode}, ISBN=${isbn}`,
    );
    try {
      const result = await firstValueFrom(
        this.httpService.get(`/itemSrch`, {
          params: {
            type: 'ALL',
            libCode: libCode,
            isbn13: isbn,
            authKey: process.env.LIBRARY_BIGDATA_API_KEY,
            pageSize: 12,
            format: 'json',
            pageNo: pageNo,
          },
        }),
      );

      const response = result.data.response as ItemSrchResponse;
      if (+response.resultNum <= 0) {
        this.logger.log(
          `도서 소장 정보 없음: libCode=${libCode}, ISBN=${isbn}`,
        );
        return {
          hasBook: false,
          libName: response.libNm,
          shelfLocation: '',
          bookCode: '',
        };
      }
      const firstDoc = response.docs?.[0]?.doc;
      const firstCallNumber = firstDoc?.callNumbers?.[0]?.callNumber;

      //'' 는 정보 없음
      const bookCode =
        firstDoc && firstCallNumber
          ? `${firstDoc.class_no}-${firstCallNumber.book_code}`
          : '';
      const shelfLocation = firstCallNumber?.shelf_loc_name ?? '';
      const libName = response.libNm;

      this.logger.log(
        `도서 소장 위치 조회 성공: ${libName}, 위치: ${shelfLocation}`,
      );
      return {
        hasBook: true,
        libName,
        shelfLocation,
        bookCode,
      };
    } catch (error) {
      this.logger.error(
        `도서 소장 위치 조회 중 오류 발생: libCode=${libCode}, ISBN=${isbn}`,
        error,
      );
      throw new InternalServerErrorException('can not get book location');
    }
  }

  @Serialize(BookDto)
  async searchBooks(
    mode: searchBooksDto['mode'],
    query: searchBooksDto['query'],
    pageNo: searchBooksDto['pageNo'] = 1,
  ) {
    this.logger.log(
      `도서 목록 검색 시작: mode=${mode}, query=${query}, pageNo=${pageNo}`,
    );
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
        this.logger.warn(`도서 목록 검색 결과 없음: query=${query}`);
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
      this.logger.log(`도서 목록 검색 성공: ${foundBooks}건 발견`);
      const responseWithPages = {
        pages: pages,
        books: books,
        numFound: foundBooks,
      };

      return responseWithPages;
    } catch (error) {
      this.logger.error(`도서 목록 검색 중 오류 발생: query=${query}`, error);
      throw new InternalServerErrorException('can not get book list');
    }
  }

  async getTrendingBooks() {
    this.logger.log('인기 도서 트렌드 조회 시작');
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
        this.logger.warn(`인기 도서 트렌드 결과 없음: date=${currentDate}`);
        return [];
      }

      const books = results.flatMap(
        (item) => item.result?.docs?.map((d) => d.doc) ?? [],
      );

      //중복제거, 최대 7개 선택
      const filteredBooks = [
        ...new Map(books.map((item) => [item.isbn13, item])).values(),
      ].slice(0, 7);

      this.logger.log(`인기 도서 트렌드 조회 성공: ${filteredBooks.length}건`);
      return filteredBooks;
    } catch (error) {
      this.logger.error('인기 도서 트렌드 조회 중 오류 발생', error);
      return [];
    }
  }

  async getPopularLoanBooks(
    pageSize: number = 10,
    pageNo: number = 1,
    kdc?: number,
  ) {
    const { startDate, endDate } = getDateRange();
    this.logger.log(
      `인기 대출 도서 조회 시작: range=${startDate}~${endDate}, kdc=${kdc}`,
    );

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
        this.logger.warn(`인기 대출 도서 결과 없음: kdc=${kdc}`);
        return [];
      }

      this.logger.log(
        `인기 대출 도서 조회 성공: ${docs.length}건 (kdc=${kdc})`,
      );
      return docs.map((item) => item.doc);
    } catch (error) {
      this.logger.error(`인기 대출 도서 조회 중 오류 발생: kdc=${kdc}`, error);
      throw new InternalServerErrorException('can not get PopularLoanBooks');
    }
  }

  async getBookLoanStatus(
    isbn: string,
    libCode: number,
  ): Promise<BookExistResponse['result']> {
    this.logger.log(
      `도서 대출 가능 여부 확인 시작: ISBN=${isbn}, libCode=${libCode}`,
    );
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
      const result = response.data.response.result;
      this.logger.log(`도서 대출 가능 여부 확인 결과: ${result.loanAvailable}`);
      return result;
    } catch (error) {
      this.logger.error(
        `도서 대출 가능 여부 확인 중 오류 발생: ISBN=${isbn}, libCode=${libCode}`,
        error,
      );
      throw new InternalServerErrorException('can not get loan status');
    }
  }

  async getAutocompleteSuggestions(query: string, mode?: 'title' | 'isbn') {
    this.logger.log(`자동완성 검색어 조회 시작: query=${query}`);
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

      this.logger.log(
        `자동완성 검색어 조회 성공: ${result.data.hits.length}건`,
      );
      return {
        hits: result.data.hits,
        query: result.data.query,
        processingTimeMs: result.data.processingTimeMs,
      };
    } catch (error) {
      this.logger.error(
        `자동완성 검색어 조회 중 오류 발생: query=${query}`,
        error,
      );
      throw new InternalServerErrorException('autocomplete search failed');
    }
  }

  async _trackingBook(isbn: string, book: BookRecord) {
    if (Object.keys(book).length === 0) {
      this.logger.warn(`trackingBook: Book not found for ISBN ${isbn}`);
      return;
    }
    this.logger.log(`도서 조회 트래킹 시작: ISBN=${isbn}`);
    try {
      const pipeline = this.redis.pipeline();
      pipeline.hincrby(REDIS_KEYS.POPULARITY_COUNT, isbn, 1);
      pipeline.hsetnx(REDIS_KEYS.POPULARITY_META, isbn, JSON.stringify(book));
      await pipeline.exec();
      this.logger.log(`도서 조회 트래킹 완료: ISBN=${isbn}`);
    } catch (error) {
      this.logger.error(`도서 조회 트래킹 중 오류 발생: ISBN=${isbn}`, error);
    }
  }
}
