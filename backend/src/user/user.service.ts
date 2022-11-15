import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Octokit } from '@octokit/rest';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userRepository: UserRepository,
  ) {}
  octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

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

  async updateRepositories(id: number): Promise<User> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const res = await this.octokit.repos.listForUser({ username: user.username });
    user.repositories = res.data;
    return this.userRepository.update(id, user);
  }
}
