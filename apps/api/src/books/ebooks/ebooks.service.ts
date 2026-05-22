import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { SearchEbooksDto } from "./dto/search-ebooks.dto";

@Injectable()
export class EbooksService {
  private readonly logger = new Logger(EbooksService.name);

  constructor(private readonly httpService: HttpService) {}

  async searchEbooks(
    mode: SearchEbooksDto["mode"],
    query: SearchEbooksDto["query"],
    pageNo: number = 1
  ) {
    try {
      this.logger.log(`Ebook 검색 중: mode=${mode}, query=${query}, pageNo=${pageNo}`);

      const apiKey = process.env.SEOJI_API_KEY;

      const params: any = {
        cert_key: apiKey,
        result_style: "json",
        page_no: pageNo,
        page_size: 10,
        ebook_yn: "Y"
      };

      if (mode === "isbn") {
        params.isbn = query;
      } else {
        params.title = query;
      }

      const response = await firstValueFrom(
        this.httpService.get("https://www.nl.go.kr/seoji/SearchApi.do", {
          params
        })
      );

      const data = response.data;

      return {
        pages: Math.ceil(Number(data.TOTAL_COUNT || 0) / 10),
        books: data.docs || [],
        numFound: Number(data.TOTAL_COUNT || 0),
      };
    } catch (error) {
      this.logger.error("searchEbooks 서비스 에러", error);
      throw new InternalServerErrorException("Ebook 목록을 가져올 수 없습니다.");
    }
  }
}
