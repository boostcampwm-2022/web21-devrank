import { getTier } from '@libs/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { AutoCompleteDto } from './dto/auto-complete.dto';
import { PinnedRepositoryDto } from './dto/pinned-repository.dto';
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

  async findOneByUsername(githubToken: string, ip: string, username: string): Promise<UserProfileDto> {
    const updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(username);
    let user = null;
    if (await this.userRepository.isDuplicatedRequestIp(ip, username)) {
      user = await this.userRepository.findOneByUsername(username);
    } else {
      user = await this.userRepository.findOneByUsernameAndUpdateViews(username);
    }
    if (!user) {
      user = await this.getAnonymousUserInfo(githubToken, username);
      await this.userRepository.createOrUpdate(user);
      await this.updateUser(user.username, githubToken);
    }
    const { totalRank, tierRank } = await this.getUserRelativeRanking(user);
    this.userRepository.setDuplicatedRequestIp(ip, username);
    user.updateDelayTime = updateDelayTime;
    user.totalRank = totalRank;
    user.tierRank = tierRank;
    return user;
  }

  async findAllByPrefixUsername(limit: number, username: string): Promise<AutoCompleteDto[]> {
    const users = await this.userRepository.findAllByPrefixUsername(limit, username);
    return users.map((user) => new AutoCompleteDto().of(user));
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

  async findOneWithUpdateViews(githubToken: string, ip: string, username: string): Promise<UserDto> {
    const updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(username);
    let user = null;
    if (await this.userRepository.isDuplicatedRequestIp(ip, username)) {
      user = await this.userRepository.findOneByUsername(username);
    } else {
      user = await this.userRepository.findOneByUsernameAndUpdateViews(username);
    }
    if (!user) {
      const octokit = new Octokit();
      try {
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
        await this.updateScore(userDto.username, githubToken);
      } catch {
        throw new NotFoundException('User not found.');
      }
    }
    this.userRepository.setDuplicatedRequestIp(ip, username);
    user.updateDelayTime = updateDelayTime;
    return user;
  }

  async setUpdateScoreDelayTime(username: string, seconds: number): Promise<any> {
    return this.userRepository.setUpdateScoreDelayTime(username, seconds);
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    return this.userRepository.createOrUpdate(user);
  }

  async getAnonymousUserInfo(githubToken: string, username: string): Promise<UserDto> {
    const octokit = new Octokit({
      auth: githubToken,
    });
    try {
      const response = await octokit.request('GET /users/{username}', {
        username: username,
      });
      const user: UserDto = {
        id: response.data.node_id,
        username: response.data.login,
        following: response.data.following,
        followers: response.data.followers,
        avatarUrl: response.data.avatar_url,
        name: response.data.name,
        company: response.data.company,
        blogUrl: response.data.blog,
        location: response.data.location,
        bio: response.data.bio,
        email: response.data.email,
      };
      return user;
    } catch {
      throw new NotFoundException('User not found.');
    }
  }

  async getUserScore(username: string, octokit: Octokit): Promise<Partial<UserDto>> {
    const res: any = await octokit.request('GET /users/{username}', {
      username: user.username,
    });
    const userId = res.data.node_id;
    //TODO: parent orderBy 적용되어야함
    const forkResponse: any = await octokit.graphql(
      `query repositories($username: String!, $id: ID) {
        user(login: $username) {
          repositories(
            first: 25
            isFork: true
            privacy: PUBLIC
            orderBy: {field: STARGAZERS, direction: DESC}
            ownerAffiliations: [OWNER]
          ) {
            nodes {
              parent {
                primaryLanguage {
                  name
                }
                diskUsage
                name
                stargazerCount
                forkCount
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(
                        author: {id: $id}
                        first: 100
                      ) {
                        nodes {
                          committedDate
                        }
                      }
                    }
                  }
                }
                languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
                  totalSize
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
    const personalResponse: any = await octokit.graphql(
      `query repositories($username: String!, $id: ID) {
        user(login: $username) {
          repositories(
            first: 25
            isFork: false
            privacy: PUBLIC
            orderBy: {field: STARGAZERS, direction: DESC}
          ) {
            nodes {
              primaryLanguage {
                name
              }
              diskUsage
              name
              stargazerCount
              forkCount
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(
                      author: {id: $id}
                      first: 100
                    ) {
                      nodes {
                        committedDate
                      }
                    }
                  }
                }
              }
              languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
                totalSize
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
    const followersResponse: any = await octokit.graphql(
      `query repositories($username: String!) {
        user(login: $username) {
          followers {
            totalCount
          }
        }
      }`,
      {
        username: user.username,
      },
    );
    const issuesResponse: any = await octokit.graphql(
      `query repositories($username: String!) {
        user(login: $username) {
          issues(
            first: 100
            orderBy: {field: CREATED_AT, direction: DESC}
          ) {
            totalCount
            edges {
              node {
                repository {
                  stargazerCount
                  forkCount
                  nameWithOwner
                }
                title
                createdAt
              }
            }
          }
        }
      }`,
      {
        username: user.username,
      },
    );

    let languagesScore = new Map();
    function getCommitScore(acc: number, repository) {
      if (!repository.defaultBranchRef) {
        return acc + 0;
      }
      if (repository.diskUsage > repository.languages.totalSize) {
        return acc + 0;
      }
      let repositoryScore = 0;
      const repositoryWeight = repository.stargazerCount;
      repository.defaultBranchRef.target.history.nodes.forEach((commit) => {
        const time = +new Date() - +new Date(commit.committedDate);
        //TODO: 매직넘버 제거
        const timeWeight = (1 / 1.0019) ** (time / 1000 / 60 / 60 / 24);
        repositoryScore += repositoryWeight * timeWeight;
      });
      repositoryScore /= 100;
      if (repositoryScore == 0) {
        return acc + 0;
      }
      console.log(repository.name, repositoryScore);
      if (repository.primaryLanguage) {
        if (languagesScore.has(repository.primaryLanguage.name)) {
          languagesScore.set(
            repository.primaryLanguage.name,
            languagesScore.get(repository.primaryLanguage.name) + repositoryScore,
          );
        } else {
          languagesScore.set(repository.primaryLanguage.name, repositoryScore);
        }
      }
      return acc + repositoryScore;
    }
    const forkRepositories = forkResponse.user.repositories.nodes.map((repository) => {
      return repository.parent;
    });

    const forkScore = forkRepositories.reduce(getCommitScore, 0);
    const followersScore = followersResponse.user.followers.totalCount / 10;
    const personalRepositories = personalResponse.user.repositories.nodes;
    const personalScore = personalRepositories.reduce(getCommitScore, 0);
    const issuesScore = issuesResponse.user.issues.edges.reduce((acc, issue) => {
      const time = +new Date() - +new Date(issue.node.createdAt);
      const timeWeight = (1 / 1.0019) ** (time / 1000 / 60 / 60 / 24);
      const repositoryWeight = issue.node.repository.stargazerCount;
      const issueScore = repositoryWeight * timeWeight;
      return acc + issueScore;
    }, 0);

    languagesScore = new Map([...languagesScore].sort((a, b) => b[1] - a[1]));
    user.commitsScore = parseInt(forkScore + personalScore);
    user.issuesScore = Math.floor(issuesScore / 1000);
    user.followers = followersResponse.user.followers.totalCount;
    user.followersScore = Math.floor(followersScore);
    user.score = user.commitsScore + user.followersScore + user.issuesScore;
    user.tier = getTier(user.score);
    user.primaryLanguages = Array.from(languagesScore.keys()).slice(0, 3);
    return this.userRepository.createOrUpdate(user);
  }

  async updateAllScore(githubToken: string): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    const promises = users.map((user) => {
      return this.updateScore(user.username, githubToken);
    });
    return Promise.all(promises);
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

  async findAllByPrefixUsername(limit: number, username: string): Promise<AutoCompleteDto[]> {
    const users = await this.userRepository.findAllByPrefixUsername(limit, username);
    return users.map((user) => new AutoCompleteDto().of(user));
  }
}
