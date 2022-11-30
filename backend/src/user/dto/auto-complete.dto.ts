import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AutoCompleteDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  of(user: UserDto): AutoCompleteDto {
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    return this;
  }
}
