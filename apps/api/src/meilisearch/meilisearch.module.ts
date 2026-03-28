import { Global, Module } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';
import { MeilisearchController } from './meilisearch.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Meilisearch } from 'meilisearch';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [MeilisearchController],
  providers: [
    {
      provide: 'MEILISEARCH_SEARCH_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Meilisearch({
          host: configService.get<string>('MEILISEARCH_HOST'),
          apiKey: configService.get<string>('MEILISEARCH_SEARCH_API_KEY'),
          timeout: 30000,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'MEILISEARCH_ADMIN_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Meilisearch({
          host: configService.get<string>('MEILISEARCH_HOST'),
          apiKey: configService.get<string>('MEILISEARCH_ADMIN_API_KEY'),
          timeout: 30000,
        });
      },
      inject: [ConfigService],
    },
    MeilisearchService,
  ],
  exports: [MeilisearchService],
})
export class MeilisearchModule {}
