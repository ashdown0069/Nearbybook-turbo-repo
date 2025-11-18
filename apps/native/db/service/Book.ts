import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { BooksTable } from "../schema";
import type { DrizzleError } from "drizzle-orm";

export const saveBookToDataBase = async (
  db: ExpoSQLiteDatabase,
  bookData: typeof BooksTable.$inferInsert,
  callback: () => void,
) => {
  try {
    await db
      .insert(BooksTable)
      .values({
        ...bookData,
      })
      .onConflictDoNothing();
  } catch (error) {
    const Error = error as DrizzleError;
    console.log(Error.message);
  } finally {
    callback();
  }
};
