import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Octokit } from '@octokit/rest';
import { Model } from 'mongoose';
import { RepositoryRepository } from './repository.repository';
import { Repository } from './repository.schema';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectModel('Repository') private readonly repositoryModel: Model<Repository>,
    private readonly repositoryRepository: RepositoryRepository,
  ) {}
  async findAll(): Promise<Repository[]> {
    return this.repositoryRepository.findAll();
  }

  async create(repository: Repository): Promise<Repository> {
    return this.repositoryRepository.create(repository);
  }

  async updateRepositoryScore(id: number, githubToken: string): Promise<Repository> {
    const repository = await this.repositoryRepository.findOneById(id);
    if (!repository) {
      throw new NotFoundException('Repository not found');
    }
    const octokit = new Octokit({
      auth: githubToken,
    });
    const res = await octokit.repos.get({ owner: repository.owner, repo: repository.name });
    repository.stargazers_count = res.data.stargazers_count;
    repository.forks_count = res.data.forks_count;
    repository.score = res.data.stargazers_count + res.data.forks_count;
    return this.repositoryRepository.update(id, repository);
  }
}
