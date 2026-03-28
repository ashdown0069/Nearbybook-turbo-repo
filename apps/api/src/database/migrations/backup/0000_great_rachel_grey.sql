CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookname" text NOT NULL,
	"authors" text,
	"publisher" text,
	"publication_year" text,
	"isbn" text NOT NULL,
	"vol" text,
	"loan_count" integer DEFAULT 0 NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"base_date" text[] DEFAULT '{}',
	"kdc" text,
	"bookImageURL" text,
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE INDEX "books_isbn_idx" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("bookname");