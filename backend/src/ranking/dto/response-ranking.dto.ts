import { UserDto } from '@apps/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseRankingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  dailyViews: number;

  @ApiProperty()
  score: number;

  @ApiProperty()
  scoreDifference: number;

  @ApiProperty()
  tier: string;

  of(user: UserDto): ResponseRankingDto {
    this.id = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.score = user.commitsScore + user.followersScore;
    this.tier = user.tier;
    this.dailyViews = user.dailyViews;
    this.scoreDifference = user.scoreDifference;
    return this;
  }
}
