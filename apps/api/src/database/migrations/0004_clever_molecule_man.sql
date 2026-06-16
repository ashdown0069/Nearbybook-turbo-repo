CREATE TABLE "holding_call_numbers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "holding_call_numbers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"library_holding_id" integer NOT NULL,
	"separate_shelf_code" text,
	"separate_shelf_name" text,
	"book_code" text,
	"shelf_loc_code" text,
	"shelf_loc_name" text,
	"copy_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holdings_books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "holdings_books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"isbn13" text NOT NULL,
	"vol" text DEFAULT '' NOT NULL,
	"bookname" text NOT NULL,
	"authors" text,
	"publisher" text,
	"publication_year" text,
	"class_no" text,
	"class_nm" text,
	"book_image_url" text,
	"addition_symbol" text,
	"set_isbn13" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "holdings_books_isbn_vol_unique" UNIQUE("isbn13","vol")
);
--> statement-breakpoint
CREATE TABLE "library_holdings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "library_holdings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"holdings_book_id" integer NOT NULL,
	"lib_code" text NOT NULL,
	"reg_date" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "library_holdings_book_lib_unique" UNIQUE("holdings_book_id","lib_code")
);
--> statement-breakpoint
ALTER TABLE "holding_call_numbers" ADD CONSTRAINT "holding_call_numbers_library_holding_id_library_holdings_id_fk" FOREIGN KEY ("library_holding_id") REFERENCES "public"."library_holdings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_holdings" ADD CONSTRAINT "library_holdings_holdings_book_id_holdings_books_id_fk" FOREIGN KEY ("holdings_book_id") REFERENCES "public"."holdings_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_holdings" ADD CONSTRAINT "library_holdings_lib_code_libraries_lib_code_fk" FOREIGN KEY ("lib_code") REFERENCES "public"."libraries"("lib_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "call_numbers_holding_id_idx" ON "holding_call_numbers" USING btree ("library_holding_id");--> statement-breakpoint
CREATE INDEX "holdings_books_isbn_idx" ON "holdings_books" USING btree ("isbn13");--> statement-breakpoint
CREATE INDEX "holdings_books_bookname_idx" ON "holdings_books" USING btree ("bookname");--> statement-breakpoint
CREATE INDEX "library_holdings_lib_code_idx" ON "library_holdings" USING btree ("lib_code");--> statement-breakpoint
CREATE INDEX "library_holdings_book_id_idx" ON "library_holdings" USING btree ("holdings_book_id");
