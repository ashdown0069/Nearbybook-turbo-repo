ALTER TABLE "searchLogs" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "searchLogs" ADD COLUMN "search_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "searchLogs" ADD COLUMN "search_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "searchLogs" ADD CONSTRAINT "search_logs_date_query_mode_unique" UNIQUE("search_date","query","mode");