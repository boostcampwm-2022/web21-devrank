import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthRepository {
  constructor(@InjectRedis() private readonly redis: Redis, private readonly configService: ConfigService) {}

  async findById(id: string): Promise<string> {
    return await this.redis.get(id);
  }

  async create(id: string, newRefreshToken: string): Promise<void> {
    await this.redis.set(id, newRefreshToken, 'EX', parseInt(this.configService.get('JWT_REFRESH_EXPIRATION')));
  }

  async delete(id: string) {
    await this.redis.del(id);
  }
}
