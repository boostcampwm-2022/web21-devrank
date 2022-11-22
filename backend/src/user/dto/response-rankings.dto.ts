import { ApiProperty } from '@nestjs/swagger';
import { ResponseRankingDto } from './response-ranking.dto';

export class ResponseRankingsDto {
  @ApiProperty()
  rankings: ResponseRankingDto[];

  of(rankings: ResponseRankingDto[]): ResponseRankingsDto {
    this.rankings = rankings;
    return this;
  }
}
