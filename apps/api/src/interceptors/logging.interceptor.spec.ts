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
    jest.restoreAllMocks();
  });

  it('요청과 응답을 로깅해야 함', (done) => {
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

  it('요청 body가 있을 때 로그에 body가 포함되어야 함', (done) => {
    const mockBody = { title: '테스트 도서', isbn: '1234567890' };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/books',
          ip: '127.0.0.1',
          body: mockBody,
          query: {},
        }),
        getResponse: () => ({ statusCode: 201 }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of('created'),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        const logMessage = loggerSpy.mock.calls[0][0];
        expect(logMessage).toContain('POST');
        expect(logMessage).toContain('/books');
        expect(logMessage).toContain('body');
        done();
      },
    });
  });

  it('요청 query params가 있을 때 로그에 query가 포함되어야 함', (done) => {
    const mockQuery = { keyword: '자바스크립트', page: '1' };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/books/search?keyword=자바스크립트&page=1',
          ip: '127.0.0.1',
          body: {},
          query: mockQuery,
        }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([]),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        const logMessage = loggerSpy.mock.calls[0][0];
        expect(logMessage).toContain('GET');
        expect(logMessage).toContain('/books/search');
        expect(logMessage).toContain('query');
        done();
      },
    });
  });

  it('body와 query가 모두 비어있으면 추가 정보 없이 기본 로그만 출력해야 함', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/health',
          ip: '127.0.0.1',
          body: {},
          query: {},
        }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of('ok'),
    } as CallHandler;

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        const logMessage = loggerSpy.mock.calls[0][0];
        expect(logMessage).toContain('GET');
        expect(logMessage).toContain('/health');
        // body/query가 비어있으면 해당 키워드가 로그에 없어야 함
        expect(logMessage).not.toContain('body');
        expect(logMessage).not.toContain('query');
        done();
      },
    });
  });
});
