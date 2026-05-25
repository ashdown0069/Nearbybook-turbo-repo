import { LoggingInterceptor } from './logging.interceptor';
import { Logger } from '@nestjs/common';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log request and response (한국어: 요청과 응답을 로깅해야 함)', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/test', ip: '127.0.0.1' }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of('test response'),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(loggerSpy).toHaveBeenCalled();
        done();
      },
    });
  });
});
