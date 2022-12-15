import { logger } from '@libs/utils';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly userRepository: UserRepository) {}

  async onApplicationBootstrap() {
    const allUsers = await this.userRepository.findAll({}, false, ['lowerUsername', 'score', 'tier', 'history']);
    await Promise.all(
      allUsers
        .filter((user) => user.history)
        .map(({ lowerUsername, score, tier }) => this.userRepository.updateCachedUserRank(tier, score, lowerUsername)),
    );
    logger.log('all user score loaded in Redis.');
  }

  healthCheck(): string {
    return 'devrank server is listening!';
  }
}
