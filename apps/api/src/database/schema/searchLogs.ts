import { pgTable, pgEnum, text, integer, timestamp } from "drizzle-orm/pg-core"

export const searchMode = pgEnum("mode", ["isbn", "title"])

export const searchLogs = pgTable("searchLogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mode: searchMode(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), // 생성 시간 추가
})
