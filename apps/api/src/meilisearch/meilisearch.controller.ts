import { Controller, Get } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';

@Controller('meilisearch')
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  @Get('/health')
  async healthCheck() {
    return await this.meilisearchService.healthCheck();
  }
}
