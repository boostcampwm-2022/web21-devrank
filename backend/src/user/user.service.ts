import { NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<any> {
    return this.userRepository.getAll();
  }

  async getById(id: string): Promise<any> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: User): Promise<any> {
    return this.userRepository.create(user);
  }

  async update(id: string, user: User): Promise<any> {
    return this.userRepository.update(id, user);
  }
}
