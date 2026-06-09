import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommonService } from '../common.service';
import { ClsService } from 'nestjs-cls';

/**
 * 모든 예외를 처리하는 전역 예외 필터
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  // 동일 에러에 대한 Discord 알림 폭주를 방지하기 위한 메모리 캐시 (5분 제한)
  private readonly discordAlertCache = new Map<string, number>();
  private readonly ALERT_THROTTLE_MS = 1000 * 60 * 5;

  // 캐시 주기적 초기화(Flush)를 위한 설정 (1시간)
  private lastResetTime = Date.now();
  private readonly CACHE_RESET_INTERVAL = 1000 * 60 * 60;

  constructor(
    private readonly commonService: CommonService,
    private readonly cls: ClsService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const now = Date.now();

    // 1시간이 경과하면 캐시를 완전히 비워 메모리 파편화를 방지합니다.
    if (now - this.lastResetTime > this.CACHE_RESET_INTERVAL) {
      this.discordAlertCache.clear();
      this.lastResetTime = now;
      this.logger.log('Discord 알림 캐시가 주기적으로 초기화되었습니다.');
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const traceId = this.cls.getId();

    // HttpException 인지 확인하여 상태 코드 결정 (아니라면 500 내부 서버 에러)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 예외 메시지 추출
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    // 500 이상의 에러 발생 시 Discord 알림 전송 (스로틀링 적용)
    if (status >= 500) {
      const alertKey = `${request.method}:${request.url}:${status}`;
      const now = Date.now();
      const lastSentTime = this.discordAlertCache.get(alertKey);

      if (!lastSentTime || now - lastSentTime > this.ALERT_THROTTLE_MS) {
        // 캐시 크기가 1000개를 초과하면 가장 오래된 항목(첫 번째 항목) 삭제
        if (this.discordAlertCache.size >= 1000) {
          const oldestKey = this.discordAlertCache.keys().next().value;
          this.discordAlertCache.delete(oldestKey);
        }
        this.discordAlertCache.set(alertKey, now);

        const errorMsg =
          exception instanceof Error ? exception.message : 'Unknown Error';
        const stack = exception instanceof Error ? exception.stack : '';

        const description = `
**[Trace ID]** ${traceId}
**[URL]** ${request.method} ${request.url}
**[Error Message]** ${errorMsg}
**[Stack Trace]** \`\`\`${stack?.substring(0, 800)}\`\`\`
      `;

        this.commonService
          .sendMessageToDiscord(
            '🚨 서버 예외 발생 (자동 감지)',
            description,
            'Error',
          )
          .catch((err) => this.logger.error('Discord 알림 전송 실패', err));
      } else {
        this.logger.log(`[Discord Skip] 동일 에러 스로틀링 중: ${alertKey}`);
      }
    }

    // Winston 로거를 통해 에러 로그 기록 (WinstonModule이 전역 Logger를 대체함)
    // message 객체를 직접 전달하여 JSON.stringify 시 발생할 수 있는 순환 참조 에러를 방지합니다.
    this.logger.error(
      `[${request.method}] ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : '',
      message,
    );

    // 응답 반환
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof HttpException
          ? (message as any).message || message
          : 'Internal server error',
    });
  }
}
