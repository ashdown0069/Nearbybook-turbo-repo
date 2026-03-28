import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AutoCompleteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  query: string;

  @IsOptional()
  @IsEnum(['title', 'isbn'], {
    message: 'mode must be either title or isbn',
  })
  mode?: 'title' | 'isbn';
}
