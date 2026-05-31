import { pgTable, pgEnum, text, integer, date, unique } from "drizzle-orm/pg-core"

export const searchMode = pgEnum("mode", ["isbn", "title"])

export const searchLogs = pgTable("searchLogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mode: searchMode(),
  query: text("query").notNull(),
  searchDate: date("search_date").defaultNow().notNull(), // 생성 시간 대신 일별 집계 검색 발생 날짜
  count: integer("search_count").default(1).notNull(), // 검색 횟수 컬럼 추가
}, (table) => [
  // 복합 유니크 제약 설정: 동일 날짜 + 동일 검색어 + 동일 모드의 중복 저장을 막고 Upsert의 기준 키가 됨
  unique("search_logs_date_query_mode_unique").on(table.searchDate, table.query, table.mode)
])

