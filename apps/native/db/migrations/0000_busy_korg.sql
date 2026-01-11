CREATE TABLE `books_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bookname` text NOT NULL,
	`authors` text NOT NULL,
	`publisher` text NOT NULL,
	`publicationYear` text NOT NULL,
	`isbn` text NOT NULL,
	`vol` text NOT NULL,
	`bookImageURL` text NOT NULL
);
