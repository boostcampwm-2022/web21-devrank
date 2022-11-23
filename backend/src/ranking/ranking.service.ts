import { UserDto } from '@apps/user/dto/user.dto';
import { UserRepository } from '@apps/user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  constructor(private readonly userRepository: UserRepository) {}

  async getRankings(count: number): Promise<UserDto[]> {
    const users = await this.userRepository.findAll(count);
    users.sort((a, b) => {
      return b.commitsScore + b.followersScore - (a.commitsScore + a.followersScore);
    });
    return users;
  }

  async getMostRisingRankings(count: number): Promise<UserDto[]> {
    return this.userRepository.getMostRisingRankings(count);
  }

  async getMostViewedRankings(count: number): Promise<UserDto[]> {
    return this.userRepository.getMostViewedRankings(count);
  }

  async getRankingsByUsername(username: string): Promise<UserDto[]> {
    const users = await this.userRepository.findAllByUsername(username);
    users.sort((a, b) => {
      return b.commitsScore + b.followersScore - (a.commitsScore + a.followersScore);
    });
    return users;
  }
}
