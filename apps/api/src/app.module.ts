import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { BooksModule } from './books/books.module';
import { LibrariesModule } from './libraries/libraries.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
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
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: any) => uuidv4(),
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    DatabaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'rate-limit',
          ttl: 60000, // 1m
          limit: 60,
          blockDuration: 60 * 10 * 1000, //10 min
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
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
