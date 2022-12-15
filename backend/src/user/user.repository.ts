import { RankingPaginationDto } from '@apps/ranking/dto/ranking-pagination.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { KR_TIME_DIFF, RANK_CACHE_DELAY } from '@libs/consts';
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

  async findAll(filter = {}, isSort = false, fields = []): Promise<UserDto[]> {
    return isSort
      ? this.userModel.find(filter).select(fields.join(' ')).sort({ score: -1 }).lean().exec()
      : this.userModel.find(filter).select(fields.join(' ')).lean().exec();
  }

  async findOneByFilter(filter: object): Promise<UserDto> {
    return this.userModel.findOne(filter).exec();
  }

  async findOneByLowerUsername(lowerUsername: string): Promise<UserDto> {
    return this.userModel.findOne({ lowerUsername }).lean().exec();
  }

  async findOneByLowerUsernameAndUpdateViews(lowerUsername: string): Promise<UserDto> {
    return this.userModel
      .findOneAndUpdate({ lowerUsername }, { $inc: { dailyViews: 1 } }, { new: true })
      .lean()
      .exec();
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    const filter = { id: user.id };
    return this.userModel.findOneAndUpdate(filter, user, { upsert: true, new: true }).lean().exec();
  }

  async findAllByPrefixLowerUsername(limit: number, lowerUsername: string): Promise<UserDto[]> {
    return this.userModel
      .find({ lowerUsername: { $regex: `^${lowerUsername}` } })
      .limit(limit)
      .lean()
      .exec();
  }

  async findMostRisingRankings(limit = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ scoreDifference: -1 }).limit(limit).lean().exec();
  }

  async findMostViewedRankings(limit = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ dailyViews: -1 }).limit(limit).lean().exec();
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

  async isDuplicatedRequestIp(ip: string, lowerUsername: string): Promise<boolean> {
    return (await this.redis.sismember(ip, lowerUsername)) !== 0;
  }

  async setDuplicatedRequestIp(ip: string, lowerUsername: string): Promise<void> {
    this.redis.sadd(ip, lowerUsername);
    const now = +new Date() + KR_TIME_DIFF;

    const midNight = new Date(new Date().setHours(23, 59, 59));
    midNight.setHours(midNight.getHours() + 9);

    const timeToMidnight = Math.floor((+midNight - +now) / 1000);
    this.redis.expire(ip, timeToMidnight);
  }

  async setUpdateScoreDelayTime(lowerUsername: string, seconds: number): Promise<void> {
    this.redis.set(lowerUsername, 0, 'EX', seconds);
  }

  async findUpdateScoreTimeToLive(lowerUsername: string): Promise<number> {
    const timeToLive = await this.redis.ttl(lowerUsername);
    return timeToLive <= 0 ? 0 : timeToLive;
  }

  async findPaginationRankings(
    page: number,
    limit: number,
    tier: string,
    lowerUsername: string,
  ): Promise<Pick<RankingPaginationDto, 'metadata'> & { users: UserDto[] }> {
    const tierOption = tier === 'all' ? {} : { tier: tier };
    const usernameOption = lowerUsername ? { lowerUsername: { $regex: `^${lowerUsername}` } } : {};

    const result = (
      await this.userModel.aggregate([
        { $match: { ...tierOption, ...usernameOption } },
        { $sort: { score: -1, lowerUsername: -1 } },
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

  async findCachedUserRank(tier: string, lowerUsername: string): Promise<[number, number]> {
    return Promise.all([
      this.redis.zrevrank('all&', lowerUsername).then((num) => (Number.isInteger(num) ? num + 1 : null)),
      this.redis.zrevrank(`${tier}&`, lowerUsername).then((num) => (Number.isInteger(num) ? num + 1 : null)),
    ]);
  }

  async updateCachedUserRank(tier: string, score: number, lowerUsername: string): Promise<void> {
    Promise.all([this.redis.zadd('all&', score, lowerUsername), this.redis.zadd(`${tier}&`, score, lowerUsername)]);
  }

  async deleteCachedUserRank(tier: string, lowerUsername: string): Promise<void> {
    this.redis.zrem(`${tier}&`, lowerUsername);
  }
}
