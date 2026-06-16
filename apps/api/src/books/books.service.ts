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
   * HTML 태그(예: <b>, </b>)를 제거하여 가공되지 않은 순수 텍스트를 반환합니다.
   * @param text 가공할 데이터
   */
  private cleanHtmlTags(text: unknown): string {
    // 타입 가드(Type Guard)를 적용하여 문자열 타입만 안전하게 처리
    if (typeof text !== 'string') {
      return '';
    }
    // 정규식(Regex: Regular Expression)을 활용하여 모든 HTML 태그 패턴 제거
    return text.replace(/<[^>]*>/g, '');
  }

  /**
   * 네이버 책 API에서 공백으로 구분되어 반환되는 ISBN 데이터 중, 13자리 규격의 ISBN을 정밀하게 추출합니다.
   * @param isbn 원본 ISBN 데이터
   */
  private extractIsbn13(isbn: unknown): string {
    // 타입 가드(Type Guard)를 적용하여 문자열 또는 숫자 타입만 안전하게 처리
    if (typeof isbn !== 'string' && typeof isbn !== 'number') {
      return '';
    }
    const isbnStr = String(isbn).trim();
    // 공백(Whitespace)을 기준으로 구분하여 배열화
    const parts = isbnStr.split(/\s+/);
    // 길이가 13자리이면서 동시에 978 혹은 979로 시작하는 ISBN13 표준 규격을 식별(Find)
    const found = parts.find(
      (part) =>
        part.length === 13 &&
        (part.startsWith('978') || part.startsWith('979')),
    );
    return found || parts[0] || '';
  }

  /**
   * 네이버 책 검색 API를 사용하여 도서 1건을 조회합니다.
   * 도서관 빅데이터 API의 폴백(Fallback) 용도로 사용되며, 항상 최대 1건만 반환합니다.
   * @param mode 검색 모드 ('title': 제목 검색, 'isbn': ISBN 검색)
   * @param query 검색어 (제목 또는 ISBN)
   * @returns Book 객체 또는 결과 없을 시 null
   */
  @RedisCache({ ttl: 86400 })
  async searchBookFromNaver(
    mode: 'title' | 'isbn',
    query: string,
  ) {
    this.logger.log(
      `Naver API를 통한 도서 조회 시작: mode=${mode}, query=${query}`,
    );
    try {
      // 검색 모드에 따라 네이버 고급검색 파라미터(d_titl/d_isbn) 분기
      const params: Record<string, any> = { start: 1, display: 1 };
      if (mode === 'title') {
        params.d_titl = query;
      } else {
        params.d_isbn = query;
      }

      const resultXML = await this.httpService.axiosRef.get(
        'https://openapi.naver.com/v1/search/book_adv.xml',
        {
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_SECRET,
          },
          params,
        },
      );

      const bookData = this.parser.parse(
        resultXML.data,
      ) as NaverBookAdvResponse;

      if (!bookData?.rss?.channel || bookData.rss.channel.total === 0) {
        this.logger.warn(`Naver API 조회 결과 없음: query=${query}`);
        return null;
      }

      const rawItem = bookData.rss.channel.item;
      if (!rawItem) {
        this.logger.warn(`Naver API 조회 결과 아이템 없음: query=${query}`);
        return null;
      }

      // 다중/배열 결과 파싱에 대한 방어 로직(Defensive Programming) 적용
      const item = Array.isArray(rawItem) ? rawItem[0] : rawItem;
      if (!item) {
        this.logger.warn(
          `Naver API 조회 결과 첫 번째 아이템 없음: query=${query}`,
        );
        return null;
      }

      const book = {
        bookname: this.cleanHtmlTags(item.title),
        authors: this.cleanHtmlTags(item.author),
        publisher: item.publisher,
        publication_year: item.pubdate
          ? item.pubdate.toString().slice(0, 4)
          : '',
        isbn13: this.extractIsbn13(item.isbn),
        bookImageURL: item.image,
      };
      this.logger.log(`Naver API 조회 성공: ${book.bookname}`);
      return book;
    } catch (error) {
      this.logger.error(
        `Naver API 조회 중 오류 발생: query=${query}`,
        error,
      );
      throw new InternalServerErrorException('searchBookFromNaver error');
    }
  }

  @RedisCache({ ttl: 86400 })
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
        return (await this.searchBookFromNaver('isbn', isbn)) ?? ({} as any);
      }

      const detail = response.detail;
      if (!Array.isArray(detail) || detail.length === 0) {
        this.logger.warn(
          `도서관 빅데이터 API 결과 없음, Naver API로 전환: ISBN=${isbn}`,
        );
        return (await this.searchBookFromNaver('isbn', isbn)) ?? ({} as any);
      }

      const foundBook = detail[0]?.book;
      if (!foundBook) {
        this.logger.warn(
          `도서관 빅데이터 API 북 데이터 없음, Naver API로 전환: ISBN=${isbn}`,
        );
        return (await this.searchBookFromNaver('isbn', isbn)) ?? ({} as any);
      }
      this.logger.log(`도서 상세 조회 성공: ${foundBook.bookname}`);
      return foundBook;
    } catch (error) {
      this.logger.error(
        `도서 상세 조회 중 오류 발생, Naver API 시도: ISBN=${isbn}`,
        error,
      );
      try {
        return (await this.searchBookFromNaver('isbn', isbn)) ?? ({} as any);
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
      if (!response || !response.docs || response.docs.length === 0) {
        this.logger.warn(
          `도서 목록 검색 결과 없음, Naver API로 전환: query=${query}`,
        );
        return await this.naverFallbackForBooks(mode, query);
      }

      const foundBooks = response.numFound;
      const pageSize = 12;
      const pages = Math.ceil(foundBooks / pageSize);
      const books = response.docs.map((item) => item.doc);

      this.logger.log(`도서 목록 검색 성공: ${foundBooks}건 발견`);
      return { pages, books, numFound: foundBooks };
    } catch (error) {
      this.logger.error(
        `도서 목록 검색 중 오류 발생, Naver API 시도: query=${query}`,
        error,
      );
      try {
        return await this.naverFallbackForBooks(mode, query);
      } catch (naverError) {
        this.logger.error(
          `도서 목록 검색 최종 실패: query=${query}`,
          naverError,
        );
        throw new InternalServerErrorException('can not get book list');
      }
    }
  }

  /**
   * searchBooks의 폴백 로직을 캡슐화(Encapsulation)한 private 헬퍼.
   * searchBookFromNaver의 단건 결과를 목록 응답 형태로 래핑합니다.
   */
  private async naverFallbackForBooks(
    mode: 'title' | 'isbn',
    query: string,
  ) {
    const book = await this.searchBookFromNaver(mode, query);
    if (!book) {
      return { pages: 0, books: [], numFound: 0 };
    }
    return { pages: 1, books: [book], numFound: 1 };
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
