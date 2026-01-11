DROP INDEX `books_table_bookname_unique`;--> statement-breakpoint
DROP INDEX `books_table_publisher_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `books_table_isbn_unique` ON `books_table` (`isbn`);