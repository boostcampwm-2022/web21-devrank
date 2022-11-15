import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOneByGithubId(id: number): Promise<User> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: number, user: User): Promise<User> {
    return this.userRepository.update(id, user);
  }

    return this.userRepository.update(id, user);
  }
}
