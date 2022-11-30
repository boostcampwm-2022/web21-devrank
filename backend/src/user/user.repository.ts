import { RankingPaginationDto } from '@apps/ranking/dto/ranking-pagination.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return this.userModel.find().lean().exec();
  }

  async findOneByFilter(filter: object): Promise<UserDto> {
    return this.userModel.findOne(filter).exec();
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    return this.userModel.findOne({ username: username }).lean().exec();
  }

  async findOneByUsernameAndUpdateViews(username: string): Promise<UserDto> {
    return this.userModel.findOneAndUpdate({ username: username }, { $inc: { dailyViews: 1 } }, { new: true }).exec();
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    const filter = { id: user.id };
    return this.userModel.findOneAndUpdate(filter, user, { upsert: true, new: true }).lean().exec();
  }

  async findAllByPrefixUsername(limit: number, username: string): Promise<UserDto[]> {
    return this.userModel
      .find({ username: { $regex: `^${username}` } })
      .limit(limit)
      .lean()
      .exec();
  }

  async findMostRisingRankings(limit = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ scoreDifference: -1 }).limit(limit).lean().exec();
  }

  async findMostViewedRankings(limit = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ views: -1 }).limit(limit).lean().exec();
  }

  async findMostUsedLanguages(limit = 3): Promise<{ name: string; count: number }[]> {
    const result = await this.userModel.aggregate([
      { $unwind: '$primaryLanguages' },
      { $group: { _id: '$primaryLanguages', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
    return result.map((item) => ({ name: item._id, count: item.count }));
  }

  async isDuplicatedRequestIp(ip: string, username: string): Promise<boolean> {
    return (await this.redis.sismember(ip, username)) !== 0;
  }

  async setDuplicatedRequestIp(ip: string, username: string): Promise<void> {
    this.redis.sadd(ip, username);
    const timeToMidnight = Math.floor((new Date().setHours(23, 59, 59) - Date.now()) / 1000);
    this.redis.expire(ip, timeToMidnight);
  }

  async setUpdateScoreDelayTime(username: string, seconds: number): Promise<void> {
    this.redis.set(username, 0, 'EX', seconds);
  }

  async findUpdateScoreTimeToLive(username: string): Promise<number> {
    const timeToLive = await this.redis.ttl(username);
    return timeToLive <= 0 ? 0 : timeToLive;
  }

  async findPaginationRankings(
    page: number,
    limit: number,
    tier: string,
    username: string,
  ): Promise<Pick<RankingPaginationDto, 'metadata'> & { users: UserDto[] }> {
    const tierOption = tier === 'all' ? {} : { tier: tier };
    const usernameOption = username ? { username: { $regex: `^${username}` } } : {};

    const result = (
      await this.userModel.aggregate([
        { $match: { ...tierOption, ...usernameOption } },
        { $sort: { score: -1 } },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            users: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          },
        },
      ])
    )[0];
    return { metadata: result.metadata[0], users: result.users };
  }
}
