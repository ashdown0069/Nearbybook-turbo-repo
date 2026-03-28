import { pgTable, pgEnum, text, integer } from 'drizzle-orm/pg-core';
export const searchMode = pgEnum('mode', ['isbn', 'title']);
export const searchLogs = pgTable('searchLogs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mode: searchMode(),
  query: text('query').notNull(),
});
