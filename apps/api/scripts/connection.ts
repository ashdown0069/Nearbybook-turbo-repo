import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'src/database/schema';

let pool: Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;

export function getDb(databaseUrl: string): NodePgDatabase<typeof schema> {
  if (!db) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    db = drizzle({ client: pool, schema, logger: false });
  }
  return db;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}
