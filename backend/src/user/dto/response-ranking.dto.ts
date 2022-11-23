import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ResponseRankingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  score: number;

  of(user: UserDto): ResponseRankingDto {
    this.id = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.score = user.commitsScore + user.followersScore;
    return this;
  }
}
