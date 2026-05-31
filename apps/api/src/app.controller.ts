import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FeedbackDto } from './common/dto/feedback.dto';
import { CommonService } from './common/common.service';
import { hostname } from 'os';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  async healthCheck() {
    return {
      status: 'ok',
      hostname: hostname(),
    };
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/test')
  async test() {
    console.log('cache test');
    return {
      message: 'This is a test endpoint.',
    };
  }

  @Post('/feedback')
  async feedback(@Body() Body: FeedbackDto) {
    return await this.commonService.sendMessageToDiscord(
      Body.title,
      Body.description,
      'Feedback',
      Body.email,
    );
  }
}
