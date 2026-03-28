CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nickname" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(500) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
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
CREATE TABLE "detail_regions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "detail_regions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"region_code" text NOT NULL,
	"dtl_region_code" text NOT NULL,
	"region_name" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "detail_regions_dtl_region_code_unique" UNIQUE("dtl_region_code")
);
--> statement-breakpoint
CREATE TABLE "libraries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libraries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"lib_code" text,
	"lib_name" text NOT NULL,
	"address" text NOT NULL,
	"tel" text,
	"fax" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"homepage" text,
	"closed" text,
	"operating_time" text,
	"region_code" text,
	"dtl_region_code" text,
	CONSTRAINT "libraries_lib_code_unique" UNIQUE("lib_code")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "regions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text,
	"name" text NOT NULL,
	CONSTRAINT "regions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_regions" ADD CONSTRAINT "detail_regions_region_code_regions_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "libraries" ADD CONSTRAINT "libraries_region_code_regions_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "libraries" ADD CONSTRAINT "libraries_dtl_region_code_detail_regions_dtl_region_code_fk" FOREIGN KEY ("dtl_region_code") REFERENCES "public"."detail_regions"("dtl_region_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "books_isbn_idx" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("title");