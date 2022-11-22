import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { EXPIRATION } from '@libs/const';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthRepository {
  constructor(@InjectRedis() private readonly redis: Redis, private readonly configService: ConfigService) {}

  async findRefreshTokenById(id: string): Promise<string> {
    return await this.redis.get(id);
  }

  async create(id: string, newRefreshToken: string): Promise<void> {
    await this.redis.set(id, newRefreshToken, 'EX', EXPIRATION.REFRESH_TOKEN);
  }

  async delete(id: string) {
    await this.redis.del(id);
  }
}
