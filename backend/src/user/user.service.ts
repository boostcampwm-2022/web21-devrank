import { getTier } from '@libs/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { UserDto } from './dto/user.dto';
import { RepositoryService } from './repository.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly repositoryService: RepositoryService) {}

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
      const octokit = new Octokit();
      const res = await octokit.request('GET /users/{username}', {
        username: username,
      });
      const userDto = new UserDto();
      userDto.username = res.data.login;
      userDto.avatarUrl = res.data.avatar_url;
      userDto.commitsScore = 0;
      userDto.followersScore = 0;
      userDto.score = 0;
      return this.userRepository.createOrUpdate(userDto);
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

  async findOneWithUpdateViews(ip: string, username: string): Promise<UserDto> {
    const updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(username);
    let user = null;
    if (await this.userRepository.isDuplicatedRequestIp(ip, username)) {
      user = await this.userRepository.findOneByUsername(username);
    } else {
      user = await this.userRepository.findOneByUsernameAndUpdateViews(username);
    }
    if (!user) {
      const octokit = new Octokit();
      const res = await octokit.request('GET /users/{username}', {
        username: username,
      });
      const userDto = new UserDto();
      userDto.id = res.data.node_id;
      userDto.username = res.data.login;
      userDto.avatarUrl = res.data.avatar_url;
      userDto.commitsScore = 0;
      userDto.followersScore = 0;
      userDto.score = 0;
      user = await this.userRepository.createOrUpdate(userDto);
      console.log(user);
    }
    console.log(user);
    this.userRepository.setDuplicatedRequestIp(ip, username);
    console.log(updateDelayTime);
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
                    history(
                      author: {id: $id}
                      first: 100
                    ) {
                      totalCount
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
    const score = repositories.reduce((acc: number, repository) => {
      if (!repository.defaultBranchRef) {
        return acc + 0;
      }
      const totalScore =
        ((repository.stargazers.totalCount + repository.forks.totalCount) *
          (repository.defaultBranchRef.target.history.totalCount > 100
            ? 100
            : repository.defaultBranchRef.target.history.totalCount)) /
        1000;
      console.log(repository.name, totalScore);
      return acc + totalScore;
    }, 0);
    user.commitsScore = score;
    console.log(res2.user);
    user.followers = res2.user.followers.totalCount;
    user.followersScore = res2.user.followers.totalCount;
    user.score = user.commitsScore + user.followersScore;
    user.tier = getTier(user.score);
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
