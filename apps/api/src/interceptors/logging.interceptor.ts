import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP 요청 및 응답에 대한 로깅을 수행하는 인터셉터
 * - 보안성: 민감 정보(비밀번호, 토큰 등) 자동 마스킹 처리
 * - 성능 안전성: 대용량 페이로드 직렬화 차단 (글자수 제한)
 * - 강인성: 비-HTTP 프로토콜 예외 처리 및 에러 발생 시의 로깅 보장
 * 
 * *직렬화(Serialization): 객체나 데이터 구조를 네트워크 전송이나 파일 저장이 가능한 포맷(예: JSON 문자열)으로 변환하는 과정
 * *인터셉터(Interceptor): NestJS에서 요청과 응답을 가로채어 추가적인 로직(로깅, 변환 등)을 실행할 수 있게 돕는 미들웨어 성격의 클래스
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  // 로깅 시 마스킹 처리할 민감 정보 키값 정의
  private readonly sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'card', 'ssn'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. HTTP 프로토콜이 아닌 경우 (예: WebSocket, Microservice) 안전하게 통과시킴으로써 크래시 원천 차단
    if (typeof context.getType === 'function' && context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const { method, url, ip, body, query } = req;
    const now = Date.now();

    // 2. 로그에 남길 페이로드 가공 및 마스킹 처리 진행
    const processedBody = this.sanitizePayload(body);
    const processedQuery = this.sanitizePayload(query);

    const hasBody = processedBody && Object.keys(processedBody).length > 0;
    const hasQuery = processedQuery && Object.keys(processedQuery).length > 0;

    // 공통 로깅 처리 함수
    const logRequest = (statusCode: number, isError = false) => {
      const delay = Date.now() - now;
      let message = `[${method}] ${url} ${statusCode} - ${delay}ms - IP: ${ip}`;

      if (hasBody) {
        message += ` | body: ${this.safeStringify(processedBody)}`;
      }
      if (hasQuery) {
        message += ` | query: ${this.safeStringify(processedQuery)}`;
      }

      // 에러 상황일 때는 error 레벨로, 일반 상황은 log 레벨로 출력 분기
      if (isError) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    };

    return next.handle().pipe(
      tap({
        // API 요청이 성공적으로 완료되었을 때 호출
        next: () => {
          const res = context.switchToHttp().getResponse();
          logRequest(res.statusCode, false);
        },
        // API 요청 처리 중 에러(Exception)가 발생하더라도 유실 없이 로깅 수행
        error: (err) => {
          // 예외 객체에서 상태 코드를 추출하고 없을 경우 서버 에러(500)로 폴백 처리
          const statusCode = err.status || err.statusCode || 500;
          logRequest(statusCode, true);
        }
      })
    );
  }

  /**
   * 객체 내 민감 정보를 찾아 마스킹 처리하고, 데이터가 지나치게 클 경우 축소하는 안전 장치 함수
   */
  private sanitizePayload(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // 원본 Request 객체의 데이터 훼손 방지를 위해 얕은 복사본을 활용
    const cloned = { ...data };

    for (const key of Object.keys(cloned)) {
      // 1. 민감 키값 검색 후 존재 시 별표로 마스킹 처리
      if (this.sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
        cloned[key] = '******';
      }
      // 2. 값의 크기가 지나치게 큰 경우(예: base64 이미지 등) 잘라내어 이벤트 루프 지연 방지
      else if (typeof cloned[key] === 'string' && cloned[key].length > 1000) {
        cloned[key] = cloned[key].substring(0, 100) + `... [생략됨, 총 길이: ${cloned[key].length}자]`;
      }
    }

    return cloned;
  }

  /**
   * 동기식 JSON.stringify 실행 시 발생할 수 있는 잠재적 예외 및 오버헤드를 막는 안전 직렬화 함수
   */
  private safeStringify(obj: any): string {
    try {
      const jsonStr = JSON.stringify(obj);
      // 최종 로그 문자열의 길이도 제한하여 로그 파일 오버플로우 방지
      if (jsonStr.length > 2000) {
        return jsonStr.substring(0, 2000) + '... [로그 메시지가 과도하게 길어 생략됨]';
      }
      return jsonStr;
    } catch (e) {
      return '[JSON 직렬화 실패]';
    }
  }
}
