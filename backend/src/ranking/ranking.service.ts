import { UserDto } from '@apps/user/dto/user.dto';
import { UserRepository } from '@apps/user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  constructor(private readonly userRepository: UserRepository) {}

  async getFilteredRankings(page: number, limit: number, tier: string, username: string): Promise<UserDto[]> {
    const users = await this.userRepository.findPaginationRankings(page, limit, tier, username);
    return users;
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
