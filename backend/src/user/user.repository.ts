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

  async findAll(count = 20): Promise<UserDto[]> {
    return this.userModel.find().lean().limit(count).exec();
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
    return this.userModel.findOneAndUpdate(filter, user, { upsert: true }).lean().exec();
  }

  async findAllByUsername(username: string): Promise<UserDto[]> {
    return this.userModel
      .find({ username: { $regex: `^${username}` } })
      .sort({ score: -1 })
      .lean()
      .exec();
  }

  async findMostRisingRankings(count = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ scoreDifference: -1 }).limit(count).lean().exec();
  }

  async findMostViewedRankings(count = 3): Promise<UserDto[]> {
    return this.userModel.find().sort({ views: -1 }).limit(count).lean().exec();
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

  async findPaginationRankings(page: number, limit: number, tier: string, username: string): Promise<UserDto[]> {
    const tierOption = tier === 'all' ? {} : { tier: tier };
    const usernameOption = username ? { username: { $regex: `^${username}` } } : {};

    return this.userModel
      .find({ ...tierOption, ...usernameOption })
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }
}
