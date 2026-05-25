import { AllExceptionsFilter } from './all-exceptions.filter';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { CommonService } from '../common.service';
import { ClsService } from 'nestjs-cls';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggerSpy: jest.SpyInstance;
  let commonService: jest.Mocked<CommonService>;
  let clsService: jest.Mocked<ClsService>;

  beforeEach(() => {
    commonService = {
      sendMessageToDiscord: jest.fn().mockResolvedValue(true),
    } as any;
    clsService = {
      getId: jest.fn().mockReturnValue('test-trace-id'),
    } as any;
    filter = new AllExceptionsFilter(commonService, clsService);
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log exception and format response', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    const mockArgumentsHost = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/error-test', ip: '127.0.0.1' }),
        getResponse: () => ({ status: mockStatus }),
      }),
    } as unknown as ArgumentsHost;

    const error = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(error, mockArgumentsHost);

    expect(loggerSpy).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(commonService.sendMessageToDiscord).not.toHaveBeenCalled();
  });

  it('should send discord message when status >= 500', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    const mockArgumentsHost = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'POST', url: '/server-error', ip: '127.0.0.1' }),
        getResponse: () => ({ status: mockStatus }),
      }),
    } as unknown as ArgumentsHost;

    const error = new Error('Critical server error');

    filter.catch(error, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(commonService.sendMessageToDiscord).toHaveBeenCalledWith(
      '🚨 서버 예외 발생 (자동 감지)',
      expect.stringContaining('Critical server error'),
      'Error'
    );
  });
});
