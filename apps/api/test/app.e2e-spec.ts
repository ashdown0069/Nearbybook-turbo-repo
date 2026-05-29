import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { DATABASE_CONNECTION, DATABASE_POOL } from "./../src/database/database.provider";
import { REDIS_CLIENT } from "./../src/constant/tokens";

describe("AppController (E2E 테스트)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    // 외부 인프라(PostgreSQL 커넥션 풀) 모킹
    // * 모킹(Mocking): 실제 객체를 흉내 내는 가짜 객체를 만드는 기술
    const mockPool = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    // Drizzle DB Connection 모킹
    const mockDb = {}; 
    // Redis 클라이언트 모킹
    // * 의존성 주입(Dependency Injection): 객체 간의 의존 관계를 외부에서 주입하는 패턴
    const mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_POOL)
      .useValue(mockPool)
      .overrideProvider(DATABASE_CONNECTION)
      .useValue(mockDb)
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET / 요청 시 서버 상태와 호스트명을 정상적으로 반환해야 한다", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe("ok");
        expect(res.body.hostname).toBeDefined();
      });
  });
});
