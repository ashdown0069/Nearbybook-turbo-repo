import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { MeiliSearchTaskService } from './MeiliSearchTask.service';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [MeiliSearchTaskService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
