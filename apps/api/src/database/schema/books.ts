import { pgTable, serial, index, text, integer } from 'drizzle-orm/pg-core';

export const books = pgTable(
  'books',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    authors: text('authors'),
    publisher: text('publisher'),
    publicationYear: text('publication_year'),
    isbn: text('isbn').notNull().unique(),
    vol: text('vol'),
    loanCount: integer('loan_count').notNull().default(0),
    popularity: integer('popularity').notNull().default(0),
    baseDate: text('base_date').array().default([]),
    kdc: text('kdc'),
    bookImageURL: text('bookImageURL'),
  },
  (table) => [
    index('books_isbn_idx').on(table.isbn),
    index('books_title_idx').on(table.title),
  ],
);

export type BookRecord = typeof books.$inferSelect;
export type NewBookRecord = typeof books.$inferInsert;
