import { UPDATE_DELAY_TIME } from '@libs/const';
import { BadRequestException, Controller, Get, Param, Patch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { UserGithubToken } from '../../libs/common/decorators/user-github-token.decorator';
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
  async findOneByUsername(@RealIP() ip: string, @Param('username') username: string): Promise<UserDto> {
    return this.userService.findOneWithUpdateViews(ip, username);
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
}
