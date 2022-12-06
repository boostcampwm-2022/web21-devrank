import { UserGithubToken } from '@libs/common/decorators/user-github-token.decorator';
import { UPDATE_DELAY_TIME } from '@libs/consts';
import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { AutoCompleteDto } from './dto/auto-complete.dto';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user.profile.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}
  @Get('prefix')
  @ApiOperation({ summary: '아이디의 prefix가 일치하는 유저들 목록 가져오기' })
  @ApiQuery({ name: 'limit', required: false, description: '설정 안 할 경우 기본값 5' })
  @ApiQuery({ name: 'username', required: false, description: `설정 안 할 경우 기본값 ''` })
  @ApiResponse({
    status: 200,
    description: '아이디의 prefix가 일치한 유저들의 username과 avatarUrl 리스트',
    type: AutoCompleteDto,
    isArray: true,
  })
  async findAllByPrefixUsername(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
    @Query('username', new DefaultValuePipe('')) username: string,
  ): Promise<AutoCompleteDto[]> {
    if (!username) {
      throw new BadRequestException('username is required.');
    }
    return this.userService.findAllByPrefixUsername(limit, username);
  }

  @Get(':username')
  @ApiOperation({ summary: '특정 유저 정보 가져오기(프로필 페이지)' })
  @ApiResponse({
    status: 200,
    description: '특정 유저의 정보를 가져오고, 금일 조회하지 않은 IP주소라면 조회수도 +1 업데이트',
    type: UserProfileDto,
  })
  async findOneByUsername(
    @UserGithubToken() githubToken: string,
    @RealIP() ip: string,
    @Param('username') username: string,
  ): Promise<UserProfileDto> {
    return this.userService.findOneByUsername(
      githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'),
      ip,
      username,
    );
  }

  @Patch(':username')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 유저의 점수 업데이트 (유저마다 딜레이 시간 120초)' })
  @ApiResponse({ status: 200, description: '전체 유저 정보 업데이트 성공', type: UserDto })
  async updateScore(
    @UserGithubToken() githubToken: string,
    @Param('username') username: string,
  ): Promise<UserProfileDto> {
    if ((await this.userService.findUpdateScoreTimeToLive(username)) > 0) {
      throw new BadRequestException('user score has been updated recently.');
    }
    const user = await this.userService.updateUser(
      username,
      githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'),
    );
    await this.userService.setUpdateScoreDelayTime(username, UPDATE_DELAY_TIME);
    user.updateDelayTime = UPDATE_DELAY_TIME + 3;
    return user;
  }

  @Patch('')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '모든 유저의 점수 업데이트' })
  @ApiResponse({ status: 200, description: '업데이트된 유저들 정보', type: UserDto, isArray: true })
  async updateAllScore(@UserGithubToken() githubToken: string): Promise<void> {
    await this.userService.updateAllUsers(githubToken || this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
  }
}
