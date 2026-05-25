import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP 요청 및 응답에 대한 로깅을 수행하는 인터셉터
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        const delay = Date.now() - now;
        // [메서드] URL 상태코드 - 지연시간 - IP 형식으로 로깅
        this.logger.log(`[${method}] ${url} ${statusCode} - ${delay}ms - IP: ${ip}`);
      }),
    );
  }
}
