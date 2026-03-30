import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { BooksModule } from './books/books.module';
import { LibrariesModule } from './libraries/libraries.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import * as https from 'https';
import * as http from 'http';
import CacheableLookup from 'cacheable-lookup';
import { ScheduleModule } from '@nestjs/schedule';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from './redis/redis.module';
import { createKeyv } from '@keyv/redis';
import { AopModule } from '@toss/nestjs-aop';

const cacheable = new CacheableLookup();

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 200,
  maxFreeSockets: 20,
  maxTotalSockets: 200,
  scheduling: 'lifo',
  timeout: 20000, // connection timeout
  keepAliveMsecs: 1000,
});
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 200,
  maxFreeSockets: 20,
  maxTotalSockets: 200,
  scheduling: 'lifo',
  timeout: 20000, // connection timeout
  keepAliveMsecs: 1000,
});

cacheable.install(httpAgent);
cacheable.install(httpsAgent);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'rate-limit',
          ttl: 60000, // 1m
          limit: 60,
          blockDuration: 60 * 60 * 1000, //1h
        },
      ],
    }),
    HttpModule.register({
      global: true,
      maxRedirects: 5,
      timeout: 20000,
      baseURL: 'http://data4library.kr/api',
      httpAgent,
      httpsAgent,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        stores: [createKeyv(config.get('REDIS_URL'))],
        ttl: 30 * 60 * 1000, // 30분 (ms)
        namespace: 'http-cache',
      }),
      inject: [ConfigService],
    }),
    BooksModule,
    LibrariesModule,
    CommonModule,
    AuthModule,
    TaskModule,
    ScheduleModule.forRoot(),
    MeilisearchModule,
    AopModule,
    RedisModule,
    BullModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          connection: {
            url: config.get('REDIS_URL'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
