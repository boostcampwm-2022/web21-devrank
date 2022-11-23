import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findAll(): Promise<UserDto[]> {
    return this.userModel.find().exec();
  }

  async findOne(filter: object): Promise<UserDto> {
    return this.userModel.findOne(filter).exec();
  }

  async findOneByGithubId(githubId: string): Promise<UserDto> {
    return this.userModel.findOne({ username: githubId }).exec();
  }

  async create(user: UserDto): Promise<UserDto> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    const filter = { id: user.id };
    return this.userModel.findOneAndUpdate(filter, user, { upsert: true }).exec();
  }

  async findAllByUsername(username: string): Promise<UserDto[]> {
    return this.userModel.find({ username: { $regex: username, $options: 'i' } }).exec();
  }

  async getMostRisingRankings(): Promise<UserDto[]> {
    return this.userModel.find().sort({ scoreDifference: -1 }).limit(3).exec();
  }

  async getgetMostViewedRankings(): Promise<UserDto[]> {
    return this.userModel.find().sort({ views: -1 }).limit(3).exec();
  }
}
