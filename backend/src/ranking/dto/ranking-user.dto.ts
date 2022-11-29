import { UserDto } from '@apps/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RankingUserDto {
  @ApiProperty()
  _id: string;

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

  @ApiProperty()
  primaryLanguages: string[];

  of(user: UserDto): RankingUserDto {
    this._id = user._id;
    this.id = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.score = user.commitsScore + user.followersScore + user.issuesScore;
    this.tier = user.tier;
    this.dailyViews = user.dailyViews;
    this.scoreDifference = user.scoreDifference;
    this.primaryLanguages = user.primaryLanguages;
    return this;
  }
}
