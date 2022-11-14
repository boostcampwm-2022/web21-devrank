import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from './repositories/user.repository';

export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: string, user: User): Promise<User> {
    return this.userRepository.update(id, user);
  }
}
