import { UserDto } from '@apps/user/dto/user.dto';
import { UserRepository } from '@apps/user/user.repository';
import { PAGE_UNIT_COUNT } from '@libs/consts';
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
    lowerUsername: string,
  ): Promise<RankingPaginationDto> {
    const paginationResult = await this.userRepository.findPaginationRankings(page, limit, tier, lowerUsername);
    if (!paginationResult?.metadata || paginationResult?.users.length === 0) {
      throw new NotFoundException('user not found.');
    }
    for (const user of paginationResult.users) {
      const [totalRank, tierRank] = await this.userRepository.findCachedUserRank(user.tier, user.lowerUsername);
      user.totalRank = totalRank;
      user.tierRank = tierRank;
    }

    const lastPage = Math.ceil(paginationResult.metadata.total / limit);
    const lastPageGroupNumber = Math.ceil(lastPage / PAGE_UNIT_COUNT);
    const pageGroupNumber = Math.ceil(page / PAGE_UNIT_COUNT);

    const leftStartPage = (pageGroupNumber - 1) * PAGE_UNIT_COUNT + 1;
    const rightStartPage = pageGroupNumber * PAGE_UNIT_COUNT;
    const metadata = {
      total: paginationResult.metadata.total,
      limit: limit,
      currentPage: page > lastPage ? lastPage : page,
      firstPage: 1,
      lastPage: lastPage,
      range: { left: leftStartPage, right: rightStartPage > lastPage ? lastPage : rightStartPage },
      left: pageGroupNumber !== 1,
      right: pageGroupNumber !== lastPageGroupNumber,
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

  async getMostUsedLanguages(limit: number): Promise<{ name: string; count: number }[]> {
    return this.userRepository.findMostUsedLanguages(limit);
  }
}
