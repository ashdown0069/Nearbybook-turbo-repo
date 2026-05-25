import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 모든 예외를 처리하는 전역 예외 필터입니다.
 * [원인 - 해결법 - 기대효과]
 * 원인: 핸들링되지 않은 예외가 발생할 경우 일관되지 않은 응답과 로그 누락이 발생함.
 * 해결법: 모든 예외를 Catch하여 Winston 로거를 통해 기록하고 표준화된 JSON 형식을 반환함.
 * 기대효과: 시스템 장애 추적이 용이해지고 클라이언트에게 일관된 에러 응답을 제공함.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // HttpException 인지 확인하여 상태 코드 결정 (아니라면 500 내부 서버 에러)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 예외 메시지 추출
    const message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    // Winston 로거를 통해 에러 로그 기록 (WinstonModule이 전역 Logger를 대체함)
    // 보일러플레이트: 반복적인 코드를 줄이기 위해 추상화된 일관된 코드 뭉치
    this.logger.error(
      `[${request.method}] ${request.url} ${status} - Error: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 표준화된 JSON 응답 반환
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? (message as any).message || message : 'Internal server error',
    });
  }
}
