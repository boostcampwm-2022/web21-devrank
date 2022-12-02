import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AutoCompleteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  of(user: UserDto): AutoCompleteDto {
    this.id = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    return this;
  }
}
