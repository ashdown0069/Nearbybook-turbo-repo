import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import {
  databaseProviders,
  DATABASE_CONNECTION,
  DATABASE_POOL,
} from './database.provider';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

/**
 * DB사용법
 * import { NodePgDatabase } from 'drizzle-orm/node-postgres';
 *  import * as schema from '../database/schema';
 *
 *   constructor(
 *     @Inject(DATABASE_CONNECTION)
 *     private readonly db: NodePgDatabase<typeof schema>,
 *   ) {}
 */

@Global()
@Module({
  providers: [...databaseProviders, DatabaseService],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
