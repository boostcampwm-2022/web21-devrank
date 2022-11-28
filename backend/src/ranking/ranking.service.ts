import { UserDto } from '@apps/user/dto/user.dto';
import { UserRepository } from '@apps/user/user.repository';
import { PAGE_RANGE_UNIT } from '@libs/consts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RankingPaginationDto } from './dto/ranking-pagination.dto';
import { RankingUserDto } from './dto/ranking-user.dto';

@Injectable()
export class RankingService {
  constructor(private readonly userRepository: UserRepository) {}

  async getFilteredRankings(
    page: number,
    limit: number,
    tier: string,
    username: string,
  ): Promise<RankingPaginationDto> {
    const paginationResult = await this.userRepository.findPaginationRankings(page, limit, tier, username);
    if (!paginationResult?.metadata || paginationResult?.users.length === 0) {
      throw new NotFoundException('user not found.');
    }

    const lastPage = Math.ceil(paginationResult.metadata.total / limit);
    const leftStartPage = page - PAGE_RANGE_UNIT < 1 ? 1 : page - PAGE_RANGE_UNIT;
    const rightEndPage = page + PAGE_RANGE_UNIT > lastPage ? lastPage : page + PAGE_RANGE_UNIT;
    const metadata = {
      total: paginationResult.metadata.total,
      limit: limit,
      currentPage: page > lastPage ? lastPage : page,
      firstPage: 1,
      lastPage: lastPage,
      range: { left: leftStartPage, right: rightEndPage },
      left: leftStartPage > 2,
      right: rightEndPage < lastPage,
    };

    const users = paginationResult.users.map((user) => new RankingUserDto().of(user));
    return { metadata, users };
  }

  async getMostRisingRankings(limit: number): Promise<UserDto[]> {
    const users = await this.userRepository.findMostRisingRankings(limit);
    return users;
  }

  async getMostViewedRankings(limit: number): Promise<UserDto[]> {
    return this.userRepository.findMostViewedRankings(limit);
  }

  async getRankingsByUsername(limit: number, username: string): Promise<UserDto[]> {
    const users = await this.userRepository.findAllByUsername(limit, username);
    return users;
  }
}
