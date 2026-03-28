import { createAxiosInstance } from "./axiosSetup";
import {
  useGetPopularLoanBooks,
  prefetchPopularLoanBooks,
} from "./services/books/getPopularLoanBooks";
import {
  useSearchBooksByTitle,
  PrefetchSearchBooks,
  useSearchBooks,
} from "./services/books/searchBooks";
import {
  useGetLibsByISBN,
  PrefetchGetLibsByISBN,
} from "./services/libraries/getLibsByISBN";
import {
  useGetBookLoanStatus,
  getBookLoanStatus,
} from "./services/books/getBookLoanStatus";
import {
  useGetTrendingBooks,
  prefetchGetTrendingBooks,
} from "./services/books/getTrendingBooks";
import {
  useSearchBook,
  prefetchBook,
  searchBook,
} from "./services/books/searchBook";
import { sendFeedback } from "./services/sendFeedBack";
import {
  useGetLibsList,
  useGetRegionLibsList,
} from "./services/libraries/getLibsList";
import { getLibsByISBNExtension } from "./services/libraries/getLibsByISBNExtension";
import { signup, useSignup } from "./services/auth/signup";
import { login, useLogin } from "./services/auth/login";
import { refreshToken } from "./services/auth/refresh";
import {
  getAutoCompleteResult,
  useGetAutoCompleteResult,
} from "./services/meilisearch/autocomplete";
export {
  searchBook,
  getLibsByISBNExtension,
  useGetLibsList,
  useGetRegionLibsList,
  sendFeedback,
  prefetchPopularLoanBooks,
  PrefetchGetLibsByISBN,
  PrefetchSearchBooks,
  useSearchBooks,
  useSearchBook,
  prefetchBook,
  getBookLoanStatus,
  prefetchGetTrendingBooks,
  useGetTrendingBooks,
  useGetPopularLoanBooks,
  useSearchBooksByTitle,
  useGetLibsByISBN,
  createAxiosInstance,
  useGetBookLoanStatus,
  signup,
  useSignup,
  login,
  useLogin,
  refreshToken,
  getAutoCompleteResult,
  useGetAutoCompleteResult,
};
