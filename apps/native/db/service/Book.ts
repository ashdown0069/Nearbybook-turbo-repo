import { useCallback, useState } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, type DrizzleError } from "drizzle-orm";
import { BooksTable } from "../schema"; // 경로에 맞게 수정하세요
import { useDatabase } from "../provider"; // 경로에 맞게 수정하세요

export const useBookDataBase = () => {
  const [isError, setIsError] = useState(false);

  const { db } = useDatabase();

  /**
   * 1. [READ] 저장된 모든 책 조회 (Live Query)
   */

  const { data: savedBooks, error } = useLiveQuery(
    db!.select().from(BooksTable),
  );
  if (error?.cause) {
    setIsError(() => true);
  }

  /**
   * 2. [CREATE] 책 저장 함수
   */
  const saveBook = useCallback(
    async (bookData: typeof BooksTable.$inferInsert, callback?: () => void) => {
      if (!db) return;

      try {
        await db
          .insert(BooksTable)
          .values({
            ...bookData,
          })
          .onConflictDoNothing(); // 이미 존재하는 책이면 무시

        console.log(`[DB] Saved book: ${bookData.bookname}`);
      } catch (error) {
        setIsError(() => true);
        const drizzleError = error as DrizzleError;
        console.error(`[DB Error] Save failed: ${drizzleError.message}`);
      } finally {
        if (callback) callback();
      }
    },
    [db],
  );

  /**
   * 3. [DELETE] 책 삭제 함수
   * isbn을 인자로 받아 삭제
   */
  const deleteBook = useCallback(
    async (isbn: string, callback?: () => void) => {
      if (!db) return;

      try {
        await db.delete(BooksTable).where(eq(BooksTable.isbn, isbn));
        console.log(`[DB] Deleted book with ISBN: ${isbn}`);
      } catch (error) {
        setIsError(() => true);
        const drizzleError = error as DrizzleError;
        console.error(`[DB Error] Delete failed: ${drizzleError.message}`);
      } finally {
        if (callback) callback();
      }
    },
    [db],
  );

  return {
    savedBooks: savedBooks ?? [],
    isError,
    saveBook,
    deleteBook,
  };
};
