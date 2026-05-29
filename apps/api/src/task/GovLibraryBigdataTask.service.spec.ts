import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { GovLibraryBigDataTaskService } from './GovLibraryBigdataTask.service';
import { LibrariesService } from '../libraries/libraries.service';
import { LibrariesDbService } from '../libraries/libraries-db.service';
import { CommonService } from '../common/common.service';

describe('GovLibraryBigDataTaskService', () => {
  let service: GovLibraryBigDataTaskService;
  let commonService: CommonService;

  const mockLibrariesService = {
    fetchRegionLibraryList: jest.fn(),
  };

  const mockLibrariesDbService = {
    upsertLibraries: jest.fn(),
  };

  const mockCommonService = {
    sendMessageToDiscord: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovLibraryBigDataTaskService,
        { provide: LibrariesService, useValue: mockLibrariesService },
        { provide: LibrariesDbService, useValue: mockLibrariesDbService },
        { provide: CommonService, useValue: mockCommonService },
      ],
    }).compile();

    service = module.get<GovLibraryBigDataTaskService>(GovLibraryBigDataTaskService);
    commonService = module.get<CommonService>(CommonService);

    // Mock logger to avoid noisy output
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshLibraries', () => {
    it('개발 환경에서는 작업을 건너뛰어야 함', async () => {
      process.env.NODE_ENV = 'development';
      await service.refreshLibraries();
      expect(mockCommonService.sendMessageToDiscord).not.toHaveBeenCalled();
    });

    it('성공 시 Discord 알림을 보내야 함', async () => {
      process.env.NODE_ENV = 'production';
      jest.spyOn(service as any, 'upsertLibraries').mockResolvedValue(10);

      await service.refreshLibraries();

      expect(mockCommonService.sendMessageToDiscord).toHaveBeenCalledWith(
        '도서관 정보 최신화 완료',
        '총 10건 처리',
        'Feedback',
      );
    });

    it('실패 시 Discord 알림을 보내야 함', async () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Test Error');
      jest.spyOn(service as any, 'upsertLibraries').mockRejectedValue(error);

      await service.refreshLibraries();

      expect(mockCommonService.sendMessageToDiscord).toHaveBeenCalledWith(
        '🚨 [CRON] 도서관 정보 최신화 실패',
        expect.stringContaining('Test Error'),
        'Error',
      );
    });

    it('Discord 알림 실패 시 로컬 로그를 남겨야 함 (예외를 던지지 않음)', async () => {
      process.env.NODE_ENV = 'production';
      jest.spyOn(service as any, 'upsertLibraries').mockRejectedValue(new Error('Test Error'));
      const discordError = new Error('Discord Connection Failed');
      mockCommonService.sendMessageToDiscord.mockRejectedValue(discordError);
      
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await service.refreshLibraries();

      expect(loggerSpy).toHaveBeenCalledWith('Discord 알림 전송 실패', discordError);
    });
  });
});
