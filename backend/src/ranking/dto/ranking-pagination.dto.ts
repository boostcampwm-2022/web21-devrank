import { ApiProperty } from '@nestjs/swagger';
import { RankingUserDto } from './ranking-user.dto';

class Range {
  @ApiProperty()
  left: number;
  @ApiProperty()
  right: number;
}
class PaginationMetadata {
  @ApiProperty()
  total: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  firstPage: number;
  @ApiProperty()
  lastPage: number;
  @ApiProperty()
  range: Range;
  @ApiProperty()
  left: boolean;
  @ApiProperty()
  right: boolean;
}

export class RankingPaginationDto {
  @ApiProperty()
  metadata: PaginationMetadata;

  @ApiProperty({ isArray: true, type: RankingUserDto })
  users: RankingUserDto[];
}
