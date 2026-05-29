CREATE TYPE "public"."mode" AS ENUM('isbn', 'title');--> statement-breakpoint
CREATE TABLE "searchLogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "searchLogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"mode" "mode",
	"query" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
