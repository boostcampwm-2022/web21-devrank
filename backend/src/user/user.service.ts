import { Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { UserDto } from './dto/user.dto';
import { RepositoryService } from './repository.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly repositoryService: RepositoryService) {}

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  async findOneByFilter(filter: object): Promise<UserDto> {
    const user = await this.userRepository.findOneByFilter(filter);
    if (!user) {
      throw new NotFoundException('user not found.');
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
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

  async updateRepositories(username: string, githubToken: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByUsername(username);
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

  async findUserWithUpdateViews(ip: string, username: string): Promise<UserDto> {
    const updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(username);
    if (await this.userRepository.isDuplicatedRequestIp(ip, username)) {
      const user = await this.userRepository.findOneByUsername(username);
      user.updateDelayTime = updateDelayTime;
      return user;
    }
    this.userRepository.setDuplicatedRequestIp(ip, username);
    const user = await this.userRepository.findOneByUsernameAndUpdateViews(username);
    user.updateDelayTime = updateDelayTime;
    return user;
  }

  async updateScore(username: string, githubToken: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByUsername(username);
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
          followers{
            totalCount
          }
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
      // if (!repositories.defaultBranchRef) {
      //   return 0;
      // }
      const totalScore =
        ((repository.stargazers.totalCount * 2 + repository.forks.totalCount) *
          repository.defaultBranchRef.target.history.totalCount) /
        1000;
      console.log(repository.name, totalScore);
      return acc + totalScore;
    }, 0);
    user.commitsScore = score;
    console.log(res2.user);
    user.followersScore = res2.user.followers.totalCount;
    return this.userRepository.createOrUpdate(user);
  }

  async isDuplicatedRequestIp(ip: string, username: string): Promise<boolean> {
    return this.userRepository.isDuplicatedRequestIp(ip, username);
  }
  async findUpdateScoreTimeToLive(username: string): Promise<number> {
    return this.userRepository.findUpdateScoreTimeToLive(username);
  }

  async setUpdateScoreDelayTime(username: string, seconds: number): Promise<any> {
    return this.userRepository.setUpdateScoreDelayTime(username, seconds);
  }
}
