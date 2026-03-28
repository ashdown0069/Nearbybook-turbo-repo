import { Expose, Type } from 'class-transformer';

export class AutocompleteHitDto {
  @Expose()
  title: string;

  @Expose()
  authors: string;

  @Expose()
  isbn: string;

  @Expose()
  publisher: string;

  @Expose()
  publicationYear: string;

  @Expose()
  vol: string;
}

export class AutocompleteResponseDto {
  @Type(() => AutocompleteHitDto)
  @Expose()
  hits: AutocompleteHitDto[];

  @Expose()
  query: string;

  @Expose()
  processingTimeMs: number;
}
