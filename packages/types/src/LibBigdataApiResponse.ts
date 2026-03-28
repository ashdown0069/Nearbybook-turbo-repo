// 1. 정보공개 도서관 조회
export interface LibSrchResponse {
  pageNo: string;
  pageSize: string;
  numFound: string;
  resultNum: string;
  libs: {
    lib: {
      libCode: string;
      libName: string;
      address: string;
      tel: string;
      fax: string;
      latitude: string;
      longitude: string;
      homepage: string;
      closed: string;
      operatingTime: string;
      BookCount: string;
    }[];
  };
}

// 2. 도서관별 장서/대출 데이터 조회
export interface ItemSrchResponse {
  libNm: string;
  pageNo: string;
  pageSize: string;
  numFound: string;
  resultNum: string;
  docs: {
    doc: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      set_isbn13: string;
      bookImageURL: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      callNumbers: {
        callNumber: {
          separate_shelf_code: string;
          separate_shelf_name: string;
          book_code: string;
          shelf_loc_code: string;
          shelf_loc_name: string;
          copy_code: string;
        }[];
      };
      reg_date: string;
    }[];
  };
}

// 3. 인기대출도서 조회
export interface LoanItemSrchResponse {
  resultNum: string;
  numFound: string;
  docs: {
    doc: {
      no: string;
      ranking: string;
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      bookImageURL: string;
      bookDtlUrl: string;
      loan_count: string;
    }[];
  };
}

// 4. 마니아를 위한 추천도서 조회
export interface ManiaRecommandListResponse {
  resultNum: string;
  docs: {
    book: {
      no: string;
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      bookImageURL: string;
    }[];
  };
}

// 5. 다독자를 위한 추천도서 조회
export interface ReaderRecommandListResponse {
  resultNum: string;
  docs: {
    book: {
      no: string;
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      bookImageURL: string;
    }[];
  };
}

// 6. 도서 상세 조회
export interface SrchDtlListResponse {
  detail: {
    book: {
      no: string;
      bookname: string;
      authors: string;
      publisher: string;
      publication_date: string;
      publication_year: string;
      isbn: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      description: string;
      bookImageURL: string;
      loanInfo: {
        Total: {
          ranking: string;
          name: string;
          loanCnt: string;
        };
        regionResult: {
          region: {
            ranking: string;
            name: string;
            loanCnt: string;
          }[];
        };
        ageResult: {
          age: {
            ranking: string;
            name: string;
            loanCnt: string;
          }[];
        };
        genderResult: {
          gender: {
            ranking: string;
            name: string;
            loanCnt: string;
          }[];
        };
      };
    }[];
  };
}

// 7. 도서 키워드 목록
export interface KeywordListResponse {
  resultNum: string;
  items: {
    item: {
      word: string;
      weight: string;
    }[];
  };
  additionalItem: {
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    isbn13: string;
    vol: string;
  };
}

// 8. 도서별 이용 분석
export interface UsageAnalysisListResponse {
  book: {
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    isbn13: string;
    addition_symbol: string;
    vol: string;
    class_no: string;
    class_nm: string;
    description: string;
    bookImageURL: string;
    loanCnt: string;
  };
  loanHistory: {
    loan: {
      month: string;
      loanCnt: string;
      ranking: string;
    }[];
  };
  loanGrps: {
    loanGrp: {
      age: string;
      gender: string;
      loanCnt: string;
      ranking: string;
    }[];
  };
  keywords: {
    keyword: {
      word: string;
      weight: string;
    }[];
  };
  coLoanBooks: {
    book: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      vol: string;
    }[];
  };
  maniaRecBooks: {
    book: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      vol: string;
    }[];
  };
  readerRecBooks: {
    book: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      vol: string;
    }[];
  };
}

// 9. 도서관/지역별 인기대출 도서 조회
export interface LoanItemSrchByLibResponse {
  libNm: string;
  regionNm: string;
  dtlregionNm: string;
  resultNum: string;
  docs: {
    doc: {
      no: string;
      ranking: string;
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      bookImageURL: string;
      bookDtlUrl: string;
      loan_count: string;
    }[];
  };
}

// 10. 도서관별 대출반납추이
export interface UsageTrendResponse {
  libNm: string;
  results: {
    result: {
      dayOfWeek: string;
      hour: string;
      loan: string;
      return: string;
    }[];
  };
}

// 11. 도서관별 도서 소장여부 및 대출 가능여부 조회
export interface BookExistResponse {
  result: {
    hasBook: string;
    loanAvailable: string;
  };
}

// 12. 대출 급상승 도서
export interface HotTrendResponse {
  results: {
    result: {
      date: string;
      docs: {
        doc: {
          no: string;
          difference: string;
          baseWeekRank: string;
          pastWeekRank: string;
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          addition_symbol: string;
          vol: string;
          class_no: string;
          class_nm: string;
          bookImageURL: string;
          bookDtlUrl: string;
        }[];
      };
    }[];
  };
}

// 13. 도서 소장 도서관 조회
export interface LibSrchByBookResponse {
  pageNo: string;
  pageSize: string;
  numFound: string;
  resultNum: string;
  libs: {
    lib: {
      libCode: string;
      libName: string;
      address: string;
      tel: string;
      fax: string;
      latitude: string;
      longitude: string;
      homepage: string;
      closed: string;
      operatingTime: string;
    }[];
  };
}

// 14. 도서관별 통합정보
export interface ExtendsLibSrchResponse {
  pageNo: string;
  pageSize: string;
  numFound: string;
  resultNum: string;
  libs: {
    lib: {
      libInfo: {
        libCode: string;
        libName: string;
        address: string;
        tel: string;
        fax: string;
        latitude: string;
        longitude: string;
        homepage: string;
        closed: string;
        operatingTime: string;
        BookCount: string;
      };
      loanByhours: {
        result: {
          hour: string;
          loan: string;
          return: string;
        }[];
      };
      loanByDayofWeek: {
        result: {
          dayOfWeek: string;
          loan: string;
          return: string;
        }[];
      };
      newBooks: {
        book: {
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          set_isbn13: string;
          bookImageURL: string;
          addition_symbol: string;
          vol: string;
          class_no: string;
          class_nm: string;
          reg_date: string;
        }[];
      };
    }[];
  };
}

// 15. 도서관별 인기대출도서 통합
export interface ExtendsLoanItemSrchByLibResponse {
  loanBooks: {
    book: ExtendsLoanItemBook[];
  };
  age0Books: {
    book: ExtendsLoanItemBook[];
  };
  age6Books: {
    book: ExtendsLoanItemBook[];
  };
  age8Books: {
    book: ExtendsLoanItemBook[];
  };
  age14Books: {
    book: ExtendsLoanItemBook[];
  };
  age20Books: {
    book: ExtendsLoanItemBook[];
  };
}

export interface ExtendsLoanItemBook {
  no: string;
  ranking: string;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  addition_symbol: string;
  vol: string;
  class_no: string;
  class_nm: string;
  bookImageURL: string;
  bookDtlUrl: string;
}

// 16. 도서 검색
export interface SrchBooksResponse {
  numFound: string;
  docs: {
    doc: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      bookImageURL: string;
      bookDtlUrl: string;
      loan_count: string;
    }[];
  };
}

// 17. 이달의 키워드
export interface MonthlyKeywordsResponse {
  keywords: {
    keyword: {
      word: string;
      weight: string;
    }[];
  };
}

// 18. 지역별 독서량/독서율
export interface ReadQtResponse {
  results: {
    result: {
      age: string;
      quantity: string;
      rate: string;
    }[];
  };
}

// 19. 신착도서 조회
export interface NewArrivalBookResponse {
  libNm: string;
  pageNo: string;
  pageSize: string;
  numFound: string;
  resultNum: string;
  docs: {
    doc: {
      bookname: string;
      authors: string;
      publisher: string;
      publication_year: string;
      isbn13: string;
      set_isbn13: string;
      bookImageURL: string;
      addition_symbol: string;
      vol: string;
      class_no: string;
      class_nm: string;
      reg_date: string;
    }[];
  };
}
