import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '모든 유저 정보 가져오기' })
  @ApiResponse({ status: 200, description: '모든 유저 정보' })
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':githubId')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  async findOneByGithubId(@Param('githubId') githubId: string): Promise<UserDto> {
    return this.userService.findOneByGithubId(githubId);
  }

  @Get('update-score/:githubId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 유저의 저장소 점수 업데이트' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  async updateScore(@Param('githubId') githubId: string): Promise<UserDto> {
    const githubToken = '';
    this.userService.updateFollowersScore(githubId, githubToken);
    this.userService.updateCommitsScore(githubId, githubToken);
    return this.userService.findOneByGithubId(githubId);
  }
}
