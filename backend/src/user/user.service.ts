import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Octokit } from '@octokit/core';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { RepositoryService } from './repository.service';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userRepository: UserRepository,
    private readonly repositoryService: RepositoryService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  async findOneByFilter(filter: object): Promise<UserDto> {
    const user = await this.userRepository.findOne(filter);
    if (!user) {
      throw new NotFoundException('user not found.');
    }
    return user;
  }

  async findOneByGithubId(githubId: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByGithubId(githubId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async create(user: UserDto): Promise<UserDto> {
    return this.userRepository.create(user);
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    if (!user.commitsScore) {
      user.commitsScore = 0;
    }
    if (!user.followersScore) {
      user.followersScore = 0;
    }
    return this.userRepository.createOrUpdate(user);
  }

  async updateRepositories(id: string, githubToken: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const octokit = new Octokit({
      auth: githubToken,
    });
    const res = await octokit.request('GET /users/{username}/repos', {
      username: user.username,
    });
    const repositories = res.data.map((repo) => {
      return repo.id;
    });
    user.repositories = repositories;
    return this.userRepository.createOrUpdate(user);
  }

  /*async updateScore(id: number): Promise<User> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const repositories = await this.repositoryService.findAll();
    const userRepositories = repositories.filter((repository) => {
      return user.repositories.includes(repository.id);
    });
    user.score = userRepositories.reduce((acc, repository) => {
      return acc + repository.score;
    }, 0);
    return this.userRepository.update(id, user);
  }*/

  async updateFollowersScore(id: string, githubToken: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const octokit = new Octokit({
      auth: githubToken,
    });
    const res = await octokit.request('GET /users/{username}/followers', {
      username: user.username,
    });
    user.followersScore = res.data.length;
    return this.userRepository.createOrUpdate(user);
  }

  async updateCommitsScore(githubId: string, githubToken: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByGithubId(githubId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const octokit = new Octokit({
      auth: githubToken,
    });
    const res: any = await octokit.request('GET /users/{username}', {
      username: user.username,
    });
    const userId = res.node_id;
    const res2: any = await octokit.graphql(
      `query repositories($username: String!, $id: ID) {
        user(login: $username) {
          repositories(
            first: 100
            isFork: false
            privacy: PUBLIC
            orderBy: {field: STARGAZERS, direction: DESC}
          ) {
            nodes {
              name
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(author: {id: $id}) {
                      totalCount
                      nodes {
                        committedDate
                      }
                    }
                  }
                }
              }
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                totalSize
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }`,
      {
        username: user.username,
        id: userId,
      },
    );
    console.log(res2);
    const repositories = res2.user.repositories.nodes;
    const score = repositories.reduce((acc, repository) => {
      const totalScore =
        ((repository.stargazers.totalCount * 2 + repository.forks.totalCount) *
          repository.defaultBranchRef.target.history.totalCount) /
        1000;
      console.log(repository.name, totalScore);
      return acc + totalScore;
    }, 0);
    user.commitsScore = score;
    return this.userRepository.createOrUpdate(user);
  }
}
