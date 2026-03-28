import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FeedbackDto } from './common/dto/feedback.dto';
import { CommonService } from './common/common.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
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
