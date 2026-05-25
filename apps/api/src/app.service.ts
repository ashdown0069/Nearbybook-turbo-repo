import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  getHello(): string {
    this.logger.log("Hello World API가 호출되었습니다.")
    return "Hello World!"
  }
}
