import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserProfileDto extends UserDto {
  @ApiProperty()
  totalRank: number;

  @ApiProperty()
  tierRank: number;

  @ApiProperty()
  startExp: number;

  @ApiProperty()
  needExp: number;
}
