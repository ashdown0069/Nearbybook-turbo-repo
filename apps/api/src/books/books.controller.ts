import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';

import { LoanAvailableDto } from './dto/req/loan-available';
import { searchBooksDto } from './dto/req/search-books.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TrendingBooksDto } from './dto/res/trending.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { BookDto, BooksResponseDto } from './dto/res/books.dto';
import { AutoCompleteDto } from './dto/req/autocomplete.dto';
import { AutocompleteResponseDto } from './dto/res/autocomplete.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/autocomplete')
  @Serialize(AutocompleteResponseDto)
  async getAutocompleteSuggestions(@Query() query: AutoCompleteDto) {
    return await this.booksService.getAutocompleteSuggestions(
      query.query,
      query.mode,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @Serialize(BooksResponseDto)
  @Get('/search')
  async searchBooks(@Query() query: searchBooksDto) {
    return await this.booksService.searchBooks(
      query.mode,
      query.query,
      query.pageNo,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @Serialize(BookDto)
  @Get('/search/:isbn')
  async searchBook(@Param('isbn') isbn: string) {
    return await this.booksService.searchBook(isbn);
  }

  //검색창 밑 검색어 추천
  @UseInterceptors(CacheInterceptor)
  @Serialize(TrendingBooksDto)
  @Get('/trending')
  async getTrendingBooks() {
    return await this.booksService.getTrendingBooks();
  }

  //지도에서 사용
  @CacheTTL(60 * 30) // 30분 캐시
  @UseInterceptors(CacheInterceptor)
  @Get('/loanstatus')
  async getBookLoanStatus(@Query() query: LoanAvailableDto) {
    return await this.booksService.getBookLoanStatus(query.isbn, query.libCode);
  }

  //main page에서 사용
  @UseInterceptors(CacheInterceptor)
  @Serialize(BookDto)
  @Get('/popularloanbooks')
  async getPopularLoanBooks() {
    return await this.booksService.getPopularLoanBooks();
  }

  @Get('searchNaver/:isbn')
  async searchNaver(@Param('isbn') isbn: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '네이버 책 검색 API는 개발 환경에서만 사용할 수 있습니다.',
      );
    }
    return await this.booksService.searchBook__naver(isbn);
  }

  //컨트롤러로 노출되면 안됨 추후 삭제
  // @Get('/tracking/:isbn')
  // async trackingBook(@Param('isbn') isbn: string) {
  //   return await this.booksService._trackingBook(isbn);
  // }
}
