ALTER TABLE "books" RENAME COLUMN "bookname" TO "title";--> statement-breakpoint
DROP INDEX "books_title_idx";--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("title");