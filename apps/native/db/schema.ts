import {
  int,
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const BooksTable = sqliteTable("books_table", {
  id: int().primaryKey({ autoIncrement: true }),
  bookname: text().notNull(),
  authors: text().notNull(),
  publisher: text().notNull(),
  publicationYear: text().notNull(),
  isbn: text().notNull().unique(),
  vol: text().notNull(),
  bookImageURL: text().notNull(),
  createAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const LibrariesTable = sqliteTable("libraries_table", {
  id: int().primaryKey({ autoIncrement: true }),
  libName: text().notNull(),
  libCode: text().notNull().unique(),
  address: text().notNull(),
  homepage: text().notNull(),
  tel: text().notNull(),
  operatingTime: text().notNull(),
  closed: text().notNull(),
  latitude: text().notNull(),
  longitude: text().notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const LibraryBooksTable = sqliteTable(
  "library_Books_table",
  {
    bookId: int("book_id")
      .notNull()
      .references(() => BooksTable.id),
    libraryId: int("library_id")
      .notNull()
      .references(() => LibrariesTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.bookId, t.libraryId] })],
);
