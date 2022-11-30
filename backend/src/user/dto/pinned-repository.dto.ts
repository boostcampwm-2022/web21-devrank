import { ApiProperty } from '@nestjs/swagger';

export class PinnedRepositoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  stargazerCount: number;

  @ApiProperty()
  forks: number;

  @ApiProperty()
  languages: string[];
}
