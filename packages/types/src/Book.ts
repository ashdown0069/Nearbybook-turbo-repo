export interface Book {
  bookname: string;
  authors: string;
  publisher: string;
  publicationYear: string;
  isbn: string;
  vol: string;
  bookImageURL: string;
}

export interface BookList {
  pages: number;
  books: Book[];
  numFound: number;
}
