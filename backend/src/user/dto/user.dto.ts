import { ApiProperty } from '@nestjs/swagger';
import { History } from './history.dto';
import { OrganizationDto } from './organization.dto';
import { PinnedRepositoryDto } from './pinned-repository.dto';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  following: number;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  commitsScore?: number;

  @ApiProperty()
  issuesScore?: number;

  @ApiProperty()
  followersScore?: number;

  @ApiProperty()
  score?: number;

  @ApiProperty()
  tier?: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  blogUrl?: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  dailyViews?: number;

  @ApiProperty()
  scoreDifference?: number;

  @ApiProperty()
  updateDelayTime?: number;

  @ApiProperty()
  primaryLanguages?: string[];

  @ApiProperty({ type: History })
  history?: History;

  @ApiProperty({ isArray: true, type: PinnedRepositoryDto })
  pinnedRepositories?: PinnedRepositoryDto[];

  @ApiProperty({ isArray: true, type: OrganizationDto })
  organizations?: OrganizationDto[];
}
