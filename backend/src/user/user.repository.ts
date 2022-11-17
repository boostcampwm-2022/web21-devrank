import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByGithubId(githubId: string): Promise<User> {
    return this.userModel.findOne({ username: githubId }).exec();
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    const filter = { id: user.id };
    return this.userModel.findOneAndUpdate(filter, user, { upsert: true }).exec();
  }
}
