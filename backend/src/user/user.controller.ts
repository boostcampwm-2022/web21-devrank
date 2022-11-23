import { Payload } from '@apps/auth/types';
import { BadRequestException, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { CurrentUser } from '../../libs/common/decorators/current-user.decodator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

  @Get(':username')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiResponse({
    status: 200,
    description: '특정 유저의 정보를 가져오고, 금일 조회하지 않은 IP주소라면 조회수도 +1 업데이트',
  })
  async findOneByUsername(@RealIP() ip: string, @Param('username') username: string): Promise<UserDto> {
    return this.userService.findUserWithUpdateViews(ip, username);
  }

  @Patch(':username')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 유저의 점수 업데이트' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  @UseGuards(JwtAuthGuard) // 유저 정보 업데이트 가드 없어도 될 거 같은데?
  async updateScore(@CurrentUser() currentUser: Payload, @Param('username') username: string): Promise<UserDto> {
    if ((await this.userService.findUpdateScoreTimeToLive(username)) > 0) {
      throw new BadRequestException('user score has been updated recently.');
    }
    const { githubToken } = currentUser;
    await this.userService.updateScore(username, githubToken);
    const UPDATE_DELAY_TIME = 120;
    this.userService.setUpdateScoreDelayTime(username, UPDATE_DELAY_TIME);
    return this.userService.findOneByUsername(username);
  }
}
