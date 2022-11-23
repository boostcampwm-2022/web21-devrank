import { Payload } from '@apps/auth/types';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../libs/common/decorators/current-user.decodator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseRankingDto } from './dto/response-ranking.dto';
import { ResponseRankingsDto } from './dto/response-rankings.dto';
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

  @Get('rankings')
  @ApiOperation({ summary: '전체 랭킹 가져오기' })
  @ApiResponse({ status: 200, description: '전체 랭킹', type: ResponseRankingsDto })
  async getRankings(): Promise<ResponseRankingsDto> {
    const users = await this.userService.getRankings();
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return new ResponseRankingsDto().of(rankings);
  }

  @Get('find/:githubId')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  async findOneByGithubId(@Param('githubId') githubId: string): Promise<UserDto> {
    return this.userService.findOneByGithubId(githubId);
  }

  @Get('update-score/:githubId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 유저의 점수 업데이트' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  @UseGuards(JwtAuthGuard)
  async updateScore(@CurrentUser() currentUser: Payload, @Param('githubId') githubId: string): Promise<UserDto> {
    const { githubToken } = currentUser;
    await this.userService.updateScore(githubId, githubToken);
    return this.userService.findOneByGithubId(githubId);
  }

  @Get('rankings/:githubId')
  @ApiOperation({ summary: '특정 유저들의 랭킹 가져오기' })
  @ApiResponse({ status: 200, description: '특정 유저들의 랭킹', type: ResponseRankingsDto })
  async getRankingsByUsername(@Param('username') username: string): Promise<ResponseRankingsDto> {
    const users = await this.userService.getRankingsByUsername(username);
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return new ResponseRankingsDto().of(rankings);
  }

  async getMostRisingRankings(): Promise<ResponseRankingsDto> {
    const users = await this.userService.getMostRisingRankings();
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return new ResponseRankingsDto().of(rankings);
  }

  async getMostViewedRankings(): Promise<ResponseRankingsDto> {
    const users = await this.userService.getMostViewedRankings();
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return new ResponseRankingsDto().of(rankings);
  }
}
