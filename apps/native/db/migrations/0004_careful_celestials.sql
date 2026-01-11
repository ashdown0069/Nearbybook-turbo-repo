CREATE TABLE `libraries_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`libName` text NOT NULL,
	`libCode` text NOT NULL,
	`address` text NOT NULL,
	`homepage` text NOT NULL,
	`tel` text NOT NULL,
	`operatingTime` text NOT NULL,
	`closed` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `libraries_table_libCode_unique` ON `libraries_table` (`libCode`);--> statement-breakpoint
CREATE TABLE `library_Books_table` (
	`book_id` integer NOT NULL,
	`library_id` integer NOT NULL,
	PRIMARY KEY(`book_id`, `library_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`library_id`) REFERENCES `libraries_table`(`id`) ON UPDATE no action ON DELETE cascade
);
