import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
// import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { initialize } from "./drizzle";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
type ContextType = { db: ExpoSQLiteDatabase | null };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () => useContext(DatabaseContext);

const DrizzleStudioManager = () => {
  const sqlite = SQLite.openDatabaseSync("database.db");
  useDrizzleStudio(sqlite);
  return null;
};

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<ExpoSQLiteDatabase | null>(null);
  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      setDb(newDb);
    });
  }, []);
  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
      {db && <DrizzleStudioManager />}
    </DatabaseContext.Provider>
  );
}
