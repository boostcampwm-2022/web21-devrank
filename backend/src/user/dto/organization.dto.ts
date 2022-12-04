import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  url: string;
}
