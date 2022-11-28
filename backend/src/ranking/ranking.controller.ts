import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RankingPaginationDto } from './dto/ranking-pagination.dto';
import { RankingUserDto } from './dto/ranking-user.dto';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'score기반의 전체 랭킹 리스트' })
  @ApiQuery({ name: 'page', required: false, description: '설정 안 할 경우 기본값 1' })
  @ApiQuery({ name: 'limit', required: false, description: '설정 안 할 경우 기본값 15' })
  @ApiQuery({ name: 'tier', required: false, description: '설정 안 할 경우 기본값 all' })
  @ApiQuery({ name: 'username', required: false, description: `설정 안 할 경우 기본값 ''` })
  @ApiResponse({
    status: 200,
    description: 'limit개로 페이지네이션된 유저 랭킹 리스트 및 pagination을 위한 메타 데이터',
    type: RankingPaginationDto,
  })
  async getRankings(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    @Query('tier', new DefaultValuePipe('all')) tier: string,
    @Query('username', new DefaultValuePipe('')) username: string,
  ): Promise<RankingPaginationDto> {
    const paginationRankings = await this.rankingService.getFilteredRankings(page, limit, tier, username);
    return paginationRankings;
  }

  @Get('rise')
  @ApiOperation({ summary: 'score가 급상승한 랭킹 리스트' })
  @ApiQuery({ name: 'limit', required: false, description: '설정 안 할 경우 기본값 3' })
  @ApiResponse({
    status: 200,
    description: 'limit 길이만큼의 급상승 유저 리스트',
    type: RankingUserDto,
    isArray: true,
  })
  async getMostRisingRankings(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ): Promise<RankingUserDto[]> {
    const users = await this.rankingService.getMostRisingRankings(limit);
    const rankings = users.map((user) => new RankingUserDto().of(user));
    return rankings;
  }

  @Get('views')
  @ApiOperation({ summary: '조회수 높은 유저 리스트' })
  @ApiQuery({ name: 'limit', required: false, description: '설정 안 할 경우 기본값 3' })
  @ApiResponse({
    status: 200,
    description: 'limit 길이만큼의 조회수 높은 유저 리스트',
    type: RankingUserDto,
    isArray: true,
  })
  async getMostViewedRankings(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ): Promise<RankingUserDto[]> {
    const users = await this.rankingService.getMostViewedRankings(limit);
    const rankings = users.map((user) => new RankingUserDto().of(user));
    return rankings;
  }

  @Get(':username')
  @ApiOperation({ summary: 'username이 앞부분부터 일치하는 랭킹 리스트' })
  @ApiParam({
    name: 'username',
    required: true,
    description: '사용자의 아이디 앞부분 (대소문자 구분 O)',
  })
  @ApiResponse({
    status: 200,
    description: 'param으로 넘어온 username 문자열이 유저 아이디의 접두어인 유저 리스트',
    type: RankingUserDto,
    isArray: true,
  })
  async getRankingsByUsername(
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    @Param('username') username: string,
  ): Promise<RankingUserDto[]> {
    const users = await this.rankingService.getRankingsByUsername(limit, username);
    const rankings = users.map((user) => new RankingUserDto().of(user));
    return rankings;
  }
}
