import { UserGithubToken } from '@libs/common/decorators/user-github-token.decorator';
import { UPDATE_DELAY_TIME } from '@libs/consts';
import { BadRequestException, Controller, Get, Param, Patch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Get(':username')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiResponse({
    status: 200,
    description: '특정 유저의 정보를 가져오고, 금일 조회하지 않은 IP주소라면 조회수도 +1 업데이트',
  })
  async findOneByUsername(
    @UserGithubToken() githubToken: string,
    @RealIP() ip: string,
    @Param('username') username: string,
  ): Promise<UserDto> {
    return this.userService.findOneWithUpdateViews(
      githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'),
      ip,
      username,
    );
  }

  @Patch(':username')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 유저의 점수 업데이트 (유저마다 딜레이 시간 120초)' })
  @ApiResponse({ status: 200, description: '업데이트된 유저 정보' })
  async updateScore(@UserGithubToken() githubToken: string, @Param('username') username: string): Promise<UserDto> {
    if ((await this.userService.findUpdateScoreTimeToLive(username)) > 0) {
      throw new BadRequestException('user score has been updated recently.');
    }
    await this.userService.updateScore(username, githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
    this.userService.setUpdateScoreDelayTime(username, UPDATE_DELAY_TIME);
    return this.userService.findOneByUsername(username);
  }

  @Patch('')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '모든 유저의 점수 업데이트' })
  @ApiResponse({ status: 200, description: '업데이트된 유저들 정보' })
  async updateAllScore(@UserGithubToken() githubToken: string): Promise<UserDto[]> {
    return this.userService.updateAllScore(githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
  }

  @Get('')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '유저의 pinned 레포지토리 정보' })
  @ApiResponse({ status: 200, description: '유저의 pinned 레포지토리 정보' })
  async f2indUserPinnedRepository(@UserGithubToken() githubToken: string): Promise<UserDto[]> {
    return this.userService.updateAllScore(githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
  }

  @Get('')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '유저의 활동 history 정보' })
  @ApiResponse({ status: 200, description: '유저의 활동 history 정보' })
  async f3indUserPinnedRepository(@UserGithubToken() githubToken: string): Promise<UserDto[]> {
    return this.userService.updateAllScore(githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
  }

  @Get('')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '유저의 github 활동 정보' })
  @ApiResponse({ status: 200, description: '유저의 활동 history 정보' })
  async f4indUserPinnedRepository(@UserGithubToken() githubToken: string): Promise<UserDto[]> {
    return this.userService.updateAllScore(githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
  }
}
