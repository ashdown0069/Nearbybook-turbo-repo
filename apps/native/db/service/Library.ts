import { useCallback, useState } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, type DrizzleError } from "drizzle-orm";
import { LibrariesTable } from "../schema";
import { useDatabase } from "../provider";
import { Library } from "@repo/types";

export const useLibraryDataBase = () => {
  const [isError, setIsError] = useState(false);
  const { db } = useDatabase();

  /**
   * 1. [READ] 저장된 모든 도서관 조회 (Live Query)
   */
  const { data: savedLibraries, error } = useLiveQuery(
    db!.select().from(LibrariesTable),
  );

  // 쿼리 에러 발생 시 상태 업데이트
  if (error?.cause) {
    if (!isError) setIsError(true);
    console.error(`[DB Error] Live Query failed:`, error);
  }

  /**
   * 2. [CREATE] 도서관 저장 함수
   * LibrariesTable.$inferInsert 타입을 사용하여 타입 안전성을 보장합니다.
   */
  const saveLibrary = useCallback(
    async (
      libraryData: typeof LibrariesTable.$inferInsert,
      callback?: () => void,
    ) => {
      if (!db) return;
      //데이터가 없을 때 isActive = true
      let isActive = false;
      if (savedLibraries.length === 0) {
        isActive = true;
      }
      try {
        await db
          .insert(LibrariesTable)
          .values({
            ...libraryData,
            isActive,
          })
          .onConflictDoNothing();

        console.log(`[DB] Saved library: ${libraryData.libName}`);
      } catch (error) {
        setIsError(true);
        const drizzleError = error as DrizzleError;
        console.error(`[DB Error] Save failed: ${drizzleError.message}`);
      } finally {
        if (callback) callback();
      }
    },
    [db],
  );

  /**
   * 3. [DELETE] 도서관 삭제 함수
   * libCode(고유 코드)를 인자로 받아 해당 도서관을 삭제합니다.
   */
  const deleteLibrary = useCallback(
    async (libCode: string, callback?: () => void) => {
      if (!db) return;

      try {
        // libCode가 일치하는 행을 삭제
        await db
          .delete(LibrariesTable)
          .where(eq(LibrariesTable.libCode, libCode));
        console.log(`[DB] Deleted library with Code: ${libCode}`);
      } catch (error) {
        setIsError(true);
        const drizzleError = error as DrizzleError;
        console.error(`[DB Error] Delete failed: ${drizzleError.message}`);
      } finally {
        if (callback) callback();
      }
    },
    [db],
  );

  const updateLibraryIsActive = useCallback(
    async (libCode: string) => {
      if (!db) return;

      try {
        //기존 isActive true인 데이터는 false
        await db.update(LibrariesTable).set({ isActive: false });

        //libCode와 같은 데이터는 true
        await db
          .update(LibrariesTable)
          .set({ isActive: true })
          .where(eq(LibrariesTable.libCode, libCode));
      } catch (error) {
        setIsError(true);
        const drizzleError = error as DrizzleError;
        console.error(`[DB Error] Update failed: ${drizzleError.message}`);
      }
    },
    [db],
  );

  return {
    savedLibraries: savedLibraries ?? [], // 데이터가 없으면 빈 배열 반환
    isError,
    saveLibrary,
    deleteLibrary,
    updateLibraryIsActive,
  };
};
