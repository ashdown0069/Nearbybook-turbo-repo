import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { winstonLogger } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.use(helmet());
  app.enableCors({
    // CORS_ORIGIN 환경변수가 지정되지 않은 경우(undefined) false를 대입하여 모든 외부 크로스 도메인 요청을 차단합니다.
    origin: process.env.CORS_ORIGIN?.split(',') || false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NearbyBook API')
    .setDescription('The NearbyBook API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  winstonLogger.log(`서버가 포트 ${port}에서 시작되었습니다`);
  await app.listen(port);
}
bootstrap();
