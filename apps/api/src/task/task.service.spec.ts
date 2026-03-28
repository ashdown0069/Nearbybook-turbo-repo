import { Test, TestingModule } from '@nestjs/testing';

import { MeiliSearchTaskService } from './MeiliSearchTask.service';

describe('TaskService', () => {
  let service: MeiliSearchTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeiliSearchTaskService],
    }).compile();

    service = module.get<MeiliSearchTaskService>(MeiliSearchTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('DB에 책 정보 저장하기', async () => {});

  it('meilisearch에 책 정보 저장하기', async () => {});
});
