import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { CommonModule } from "src/common/common.module";
import { EbooksController } from "./ebooks/ebooks.controller";
import { EbooksService } from "./ebooks/ebooks.service";

@Module({
  imports: [CommonModule],
  controllers: [BooksController, EbooksController],
  providers: [BooksService, EbooksService],
  exports: [BooksService, EbooksService],
})
export class BooksModule {}
