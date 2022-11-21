import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @ApiProperty()
  code: string;
}
