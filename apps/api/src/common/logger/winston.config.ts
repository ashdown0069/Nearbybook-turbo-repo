import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { ClsServiceManager } from 'nestjs-cls';

const traceIdFormat = winston.format((info) => {
  const cls = ClsServiceManager.getClsService();
  const traceId = cls?.getId();
  if (traceId) {
    info.traceId = traceId;
  }
  return info;
});

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      format: winston.format.combine(
        traceIdFormat(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('NearbyBook', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/error',
      filename: '%DATE%.error.log',
      maxFiles: '30d',
      zippedArchive: true,
      format: winston.format.combine(
        traceIdFormat(),
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
