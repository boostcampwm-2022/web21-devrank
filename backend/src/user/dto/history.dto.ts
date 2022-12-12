import { ApiProperty } from '@nestjs/swagger';

class DailyInfo {
  @ApiProperty()
  count: number;

  @ApiProperty()
  level: number;
}

class DailyItem {
  @ApiProperty()
  dateTime: DailyInfo;
}

export class History {
  @ApiProperty()
  totalCommitContributions: number;

  @ApiProperty()
  totalIssueContributions: number;

  @ApiProperty()
  totalPullRequestContributions: number;

  @ApiProperty()
  totalPullRequestReviewContributions: number;

  @ApiProperty()
  totalRepositoryContributions: number;

  @ApiProperty()
  stargazerCount: number;

  @ApiProperty()
  forkCount: number;

  @ApiProperty()
  maxContinuousCount: number;

  @ApiProperty({
    isArray: true,
    type: DailyItem,
  })
  contributionHistory: DailyItem;
}
