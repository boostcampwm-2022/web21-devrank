import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class loginRequestDto {
  @IsString()
  @ApiProperty()
  code: string;
}
