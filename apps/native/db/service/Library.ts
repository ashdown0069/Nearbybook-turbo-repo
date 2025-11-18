import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { LibrariesTable } from "../schema";
import type { DrizzleError } from "drizzle-orm";
export const saveLibraryToDataBase = async (
  db: ExpoSQLiteDatabase,
  libData: typeof LibrariesTable.$inferInsert,
  callback: () => void,
) => {
  try {
    await db.insert(LibrariesTable).values(libData).onConflictDoNothing();
  } catch (error) {
    const Error = error as DrizzleError;
    console.log(Error.message);
  } finally {
    callback();
  }
};
