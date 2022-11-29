import { ApiProperty } from '@nestjs/swagger';

export class RankingLanguageDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  count: number;

  of(language: string, count: number): RankingLanguageDto {
    this.language = language;
    this.count = count;
    return this;
  }
}
