import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseRankingDto } from './dto/response-ranking.dto';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: '전체 랭킹 가져오기' })
  @ApiQuery({ name: 'count', required: false, description: '설정 안 할 경우 기본값 20' })
  @ApiResponse({
    status: 200,
    description: 'count 길이만큼의 score기준으로 정렬된 유저 리스트',
    type: ResponseRankingDto,
    isArray: true,
  })
  async getRankings(@Query('count') count): Promise<ResponseRankingDto[]> {
    const users = await this.rankingService.getRankings(count);
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return rankings;
  }

  @Get('rise')
  @ApiOperation({ summary: 'score 급상승 유저 리스트' })
  @ApiQuery({ name: 'count', required: false, description: '설정 안 할 경우 기본값 3' })
  @ApiResponse({
    status: 200,
    description: 'count 길이만큼의 급상승 유저 리스트',
    type: ResponseRankingDto,
    isArray: true,
  })
  async getMostRisingRankings(@Query('count') count): Promise<ResponseRankingDto[]> {
    const users = await this.rankingService.getMostRisingRankings(count);
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return rankings;
  }

  @Get('views')
  @ApiOperation({ summary: '조회수 높은 유저 리스트' })
  @ApiQuery({ name: 'count', required: false, description: '설정 안 할 경우 기본값 3' })
  @ApiResponse({
    status: 200,
    description: 'count 길이만큼의 조회수 높은 유저 리스트',
    type: ResponseRankingDto,
    isArray: true,
  })
  async getMostViewedRankings(@Query('count') count): Promise<ResponseRankingDto[]> {
    const users = await this.rankingService.getMostViewedRankings(count);
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return rankings;
  }

  @Get(':username')
  @ApiOperation({ summary: '특정 유저들의 랭킹 가져오기' })
  @ApiParam({
    name: 'username',
    required: true,
    description: '대소문자 관계없이 문자열이 유저 아이디와 (부분)일치하면 결과에 포함',
  })
  @ApiResponse({
    status: 200,
    description: 'param으로 넘어온 문자열과 일치하는 유저들 라스트',
    type: ResponseRankingDto,
    isArray: true,
  })
  async getRankingsByUsername(@Param('username') username: string): Promise<ResponseRankingDto[]> {
    const users = await this.rankingService.getRankingsByUsername(username);
    const rankings = users.map((user) => new ResponseRankingDto().of(user));
    return rankings;
  }
}
