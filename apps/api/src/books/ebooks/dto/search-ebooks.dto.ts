import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsISBN,
  ValidateIf,
} from "class-validator";

export class SearchEbooksDto {
  /**
   * 검색 모드: 'title' (제목 검색) 또는 'isbn' (ISBN 검색)
   */
  @IsEnum(["title", "isbn"], {
    message: "mode must be either title or isbn",
  })
  @IsNotEmpty()
  mode: "title" | "isbn";

  /**
   * 검색어: 모드가 'isbn'인 경우 유효한 ISBN-13 형식이어야 함
   */
  @Transform(({ value }) => {
    return value && typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object) => object.mode === "isbn")
  @IsISBN("13")
  query: string;

  /**
   * 페이지 번호: 1 이상의 정수
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageNo: number;
}
