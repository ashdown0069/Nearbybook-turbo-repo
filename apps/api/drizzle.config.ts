import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
