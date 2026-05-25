import { AllExceptionsFilter } from './all-exceptions.filter';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
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
  });
});
