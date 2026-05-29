import "reflect-metadata";
import { SerializeInterceptor } from "./serialize.interceptor";
import { Expose } from "class-transformer";
import { of } from "rxjs";

// 테스트를 위한 간단한 DTO 클래스 정의 (DTO(Data Transfer Object): 계층 간 데이터 전송을 위한 객체)
class TestDto {
  @Expose() // class-transformer 데코레이터로 직렬화 시 포함할 필드 지정
  keepThis: string;
}

describe("SerializeInterceptor", () => {
  it("DTO에 포함되지 않은 필드(excludeExtraneousValues)를 성공적으로 필터링 제거해야 한다", (done) => {
    // 직렬화 인터셉터 인스턴스 생성 (Interceptor: 요청/응답 흐름을 가로채어 변형할 수 있는 NestJS 미들웨어 컴포넌트)
    const interceptor = new SerializeInterceptor(TestDto);
    
    // NestJS ExecutionContext의 모의(Mock) 객체
    const mockContext = {} as any;
    
    // RxJS의 'of' 연산자를 사용하여 모의 응답 스트림을 방출하는 CallHandler 생성 (RxJS: 비동기 데이터 스트림 처리를 위한 라이브러리)
    const mockCallHandler = {
      handle: () => of({ keepThis: "keep", removeThis: "remove" }),
    };

    // 인터셉터를 실행하고 반환되는 Observable 스트림 구독 및 검증
    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (val) => {
        // Expose 데코레이터가 지정된 필드는 유지되어야 함
        expect(val.keepThis).toBe("keep");
        // Expose 데코레이터가 없는 필드는 제외(excludeExtraneousValues)되어야 함
        expect(val.removeThis).toBeUndefined();
        done(); // 비동기 테스트 완료 콜백 함수 호출
      },
    });
  });
});
