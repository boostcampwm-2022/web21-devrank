import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  avatarUrl: string;

  @IsString()
  @ApiProperty()
  accessToken: string;
}
