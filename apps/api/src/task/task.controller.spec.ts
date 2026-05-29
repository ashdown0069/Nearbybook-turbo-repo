import { Test, TestingModule } from "@nestjs/testing"
import { TaskController } from "./task.controller"
import { GovLibraryBigDataTaskService } from "./GovLibraryBigdataTask.service"
import { MeiliSearchTaskService } from "./MeiliSearchTask.service"

describe("TaskController", () => {
  let controller: TaskController

  beforeEach(async () => {
    const mockGovService = {};
    const mockMeiliService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: GovLibraryBigDataTaskService, useValue: mockGovService },
        { provide: MeiliSearchTaskService, useValue: mockMeiliService },
      ],
    }).compile()

    controller = module.get<TaskController>(TaskController)
  })

  it("컨트롤러가 정상적으로 정의되어야 한다", () => {
    expect(controller).toBeDefined()
  })
})
