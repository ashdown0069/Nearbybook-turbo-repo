import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name)

  constructor() {
    this.logger.log("DatabaseService가 초기화되었습니다.")
  }
}
