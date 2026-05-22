import { Controller, Get, Query } from "@nestjs/common";
import { EbooksService } from "./ebooks.service";
import { SearchEbooksDto } from "./dto/search-ebooks.dto";

@Controller("books/ebooks")
export class EbooksController {
  constructor(private readonly ebooksService: EbooksService) {}

  @Get("/search")
  async searchEbooks(@Query() query: SearchEbooksDto) {
    return await this.ebooksService.searchEbooks(
      query.mode,
      query.query,
      query.pageNo
    );
  }
}
