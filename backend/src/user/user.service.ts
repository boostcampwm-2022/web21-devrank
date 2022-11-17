import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Octokit } from '@octokit/rest';
import { Model } from 'mongoose';
import { RepositoryService } from './repository.service';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userRepository: UserRepository,
    private readonly repositoryService: RepositoryService,
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

  async updateRepositories(id: number, githubToken: string): Promise<User> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const res = await this.octokit.repos.listForUser({ username: user.username });
    const repositories = res.data.map((repo) => {
      return repo.id;
    });
    user.repositories = repositories;
    this.repositoryService.updateRepositoryScore(id, githubToken);
    return this.userRepository.update(id, user);
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

  async updateScore(id: number, githubToken: string): Promise<User> {
    const user = await this.userRepository.findOneByGithubId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const octokit = new Octokit({
      auth: githubToken,
    });
    const res: any = await octokit.request('GET /users/{username}', {
      username: user.username,
    });
    const userId = res.data.user.id;
    const res2: any = await octokit.graphql(
      `query repositories($username: String!, $id: ID) {
        user(login: $username) {
          repositories(
            first: 100
            isFork: false
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
                        author {
                          user {
                            login
                          }
                        }
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
        username: 'Yaminyam',
        id: userId,
      },
    );
    const repositories = res2.data.user.repositories.nodes;
    const score = repositories.reduce((acc, repository) => {
      const totalScore =
        ((repository.stargazers.totalCount * 2 + repository.forks.totalCount) *
          repository.defaultBranchRef.target.history.totalCount) /
        1000;
      return acc + totalScore;
    });
    user.score = score;
    return this.userRepository.update(id, user);
  }
}
