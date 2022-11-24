import { UserDto } from '@apps/user/dto/user.dto';
import { UserRepository } from '@apps/user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  constructor(private readonly userRepository: UserRepository) {}

  async getFilteredRankings(page: number, count: number, tier: string, username: string): Promise<UserDto[]> {
    const users = await this.userRepository.findPaginationRankings(page, count, tier, username);
    return users;
  }
  async getMostScoredRankings(count: number): Promise<UserDto[]> {
    const users = await this.userRepository.findAll(count);
    users.sort((a, b) => {
      return b.commitsScore + b.followersScore - (a.commitsScore + a.followersScore);
    });
    return users;
  }

  async getMostRisingRankings(count: number): Promise<UserDto[]> {
    const users = await this.userRepository.findMostRisingRankings(count);
    return users;
  }

  async getMostViewedRankings(count: number): Promise<UserDto[]> {
    return this.userRepository.findMostViewedRankings(count);
  }

  async getRankingsByUsername(username: string): Promise<UserDto[]> {
    const users = await this.userRepository.findAllByUsername(username);
    users.sort((a, b) => {
      return b.commitsScore + b.followersScore - (a.commitsScore + a.followersScore);
    });
    return users;
  }
}
