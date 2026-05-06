import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchBookLocationDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  libCode: number;

  @IsString()
  isbn: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageNo?: number = 1;
}
