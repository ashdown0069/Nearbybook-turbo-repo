import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP 요청 및 응답에 대한 로깅을 수행하는 인터셉터
 * - 기본: [메서드] URL 상태코드 - 지연시간 - IP
 * - body/query가 비어있지 않으면 추가로 기록
 * 
 * *직렬화(Serialization): 객체나 데이터 구조를 네트워크 전송이나 파일 저장이 가능한 포맷(예: JSON 문자열)으로 변환하는 과정
 * *인터셉터(Interceptor): NestJS에서 요청과 응답을 가로채어 추가적인 로직(로깅, 변환 등)을 실행할 수 있게 돕는 미들웨어 성격의 클래스
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip, body, query } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        const delay = Date.now() - now;

        // 기본 로그 메시지
        let message = `[${method}] ${url} ${statusCode} - ${delay}ms - IP: ${ip}`;

        // body가 비어있지 않으면 추가
        const hasBody = body && Object.keys(body).length > 0;
        // query가 비어있지 않으면 추가
        const hasQuery = query && Object.keys(query).length > 0;

        if (hasBody) {
          message += ` | body: ${JSON.stringify(body)}`;
        }
        if (hasQuery) {
          message += ` | query: ${JSON.stringify(query)}`;
        }

        this.logger.log(message);
      }),
    );
  }
}
