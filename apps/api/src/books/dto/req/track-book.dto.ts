import { IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class TrackBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  authors?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  publicationYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  bookImageURL?: string;
}
