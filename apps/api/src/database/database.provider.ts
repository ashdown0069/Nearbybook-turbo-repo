import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const DATABASE_POOL = 'DATABASE_POOL';

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    useFactory: (configService: ConfigService) => {
      return new Pool({
        connectionString: configService.get<string>('DATABASE_URL'),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    },
    inject: [ConfigService],
  },
  {
    provide: DATABASE_CONNECTION,
    useFactory: (pool: Pool): NodePgDatabase<typeof schema> => {
      return drizzle(pool, { schema });
    },
    inject: [DATABASE_POOL],
  },
];
