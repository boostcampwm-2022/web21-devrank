import { GITHUB_API_DELAY } from '@libs/consts';
import { getTier, logger, tierCutOffs } from '@libs/utils';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { AutoCompleteDto } from './dto/auto-complete.dto';
import { History } from './dto/history.dto';
import { OrganizationDto } from './dto/organization.dto';
import { PinnedRepositoryDto } from './dto/pinned-repository.dto';
import { Rank } from './dto/rank.dto';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user.profile.dto';
import {
  followersQuery,
  forkRepositoryQuery,
  issueQuery,
  nonForkRepositoryQuery,
  pinnedRepositoriesQuery,
  userHistoryQuery,
} from './utils/query';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByFilter(filter: object): Promise<UserDto> {
    const user = await this.userRepository.findOneByFilter(filter);
    if (!user) {
      throw new NotFoundException('user not found.');
    }
    return user;
  }

  async findOneByUsername(githubToken: string, ip: string, username: string): Promise<UserProfileDto> {
    let user = null;
    if (await this.userRepository.isDuplicatedRequestIp(ip, username)) {
      user = await this.userRepository.findOneByUsername(username);
    } else {
      user = await this.userRepository.findOneByUsernameAndUpdateViews(username);
    }
    if (user) {
      return user;
    }
    user = await this.updateUser(username, githubToken);
    if (!user.scoreHistory) user.scoreHistory = [];
    user.scoreHistory.push({ date: new Date(), score: user.score });
    await this.userRepository.createOrUpdate(user);
    const { totalRank, tierRank } = await this.getUserRelativeRanking(user);
    this.userRepository.setDuplicatedRequestIp(ip, username);
    user.updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(username);
    user.totalRank = totalRank;
    user.tierRank = tierRank;
    user.startExp = tierCutOffs[user.tier];
    user.needExp = tierCutOffs[user.tier] - user.score;
    return user;
  }

  async findAllByPrefixUsername(limit: number, username: string): Promise<AutoCompleteDto[]> {
    const users = await this.userRepository.findAllByPrefixUsername(limit, username);
    return users.map((user) => new AutoCompleteDto().of(user));
  }

  async updateUser(username: string, githubToken: string): Promise<UserProfileDto> {
    let user = await this.getUserInfo(githubToken, username);
    user = await this.userRepository.createOrUpdate(user);
    const octokit = new Octokit({
      auth: githubToken,
    });
    const [scores, history, { organizations, pinnedRepositories }] = await Promise.all([
      this.getUserScore(username, octokit),
      this.getUserHistory(username, octokit),
      this.getUserOrganizationAndPinnedRepositories(username, octokit),
    ]);
    const updatedUser: UserDto = {
      ...user,
      ...scores,
      history,
      organizations,
      pinnedRepositories,
    };
    user = await this.userRepository.createOrUpdate(updatedUser);
    const { totalRank, tierRank } = await this.getUserRelativeRanking(user);
    const userWithRank: UserProfileDto = {
      ...user,
      totalRank,
      tierRank,
      startExp: tierCutOffs[user.tier],
      needExp: tierCutOffs[user.tier] - user.score,
    };
    return userWithRank;
  }

  async updateAllUsers(githubToken: string): Promise<void> {
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    const users = await this.userRepository.findAll({}, false, ['username']);
    for (const user of users) {
      await sleep(GITHUB_API_DELAY);
      try {
        await this.updateUser(user.username, githubToken);
      } catch {
        logger.error(`can't update user ${user.username}`);
      }
    }
  }

  async dailyUpdateAllUsers(githubToken: string): Promise<void> {
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    const users = await this.userRepository.findAll({}, false, ['username']);
    for (const user of users) {
      await sleep(GITHUB_API_DELAY);
      try {
        await this.updateUser(user.username, githubToken);
        const updatedUser = await this.updateUser(user.username, githubToken);
        if (!updatedUser.scoreHistory) updatedUser.scoreHistory = [];
        updatedUser.scoreHistory.push({
          date: new Date(),
          score: user.score,
        });
        updatedUser.scoreDifference =
          updatedUser.score - updatedUser.scoreHistory[updatedUser.scoreHistory.length - 2].score;
        updatedUser.dailyViews = 0;
        this.userRepository.createOrUpdate(updatedUser);
      } catch {
        logger.error(`can't update user ${user.username}`);
      }
    }
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

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    return this.userRepository.createOrUpdate(user);
  }

  async getUserInfo(githubToken: string, username: string): Promise<UserDto> {
    const octokit = new Octokit({
      auth: githubToken,
    });
    try {
      const response = await octokit.request('GET /users/{username}', {
        username: username,
      });
      if (response.data.type !== 'User') {
        throw new NotFoundException('User not found.');
      }
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
      username,
    });
    const id = res.data.node_id;

    try {
      const forkResponse: any = await octokit.graphql(forkRepositoryQuery, {
        username,
        id,
      });

      const personalResponse: any = await octokit.graphql(nonForkRepositoryQuery, {
        username,
        id,
      });

      const followersResponse: any = await octokit.graphql(followersQuery, {
        username,
      });

      const issuesResponse: any = await octokit.graphql(issueQuery, {
        username,
      });

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
      const followersScore = Math.floor(followersResponse.user.followers.totalCount / 10);
      const personalRepositories = personalResponse.user.repositories.nodes;
      const personalScore = personalRepositories.reduce(getCommitScore, 0);
      const commitsScore = parseInt(forkScore + personalScore);
      const issuesScore = Math.floor(
        issuesResponse.user.issues.edges.reduce((acc, issue) => {
          const time = +new Date() - +new Date(issue.node.createdAt);
          const timeWeight = (1 / 1.0019) ** (time / 1000 / 60 / 60 / 24);
          const repositoryWeight = issue.node.repository.stargazerCount;
          const issueScore = repositoryWeight * timeWeight;
          return acc + issueScore;
        }, 0) / 1000,
      );
      const score = commitsScore + followersScore + issuesScore;
      languagesScore = new Map([...languagesScore].sort((a, b) => b[1] - a[1]));
      return {
        commitsScore,
        issuesScore,
        followersScore,
        score,
        tier: getTier(score),
        primaryLanguages: Array.from(languagesScore.keys()).slice(0, 3),
      };
    } catch {
      throw new HttpException(`can't update this user.`, HttpStatus.NO_CONTENT);
    }
  }

  async getUserHistory(username: string, octokit: Octokit): Promise<History> {
    const { user: response }: any = await octokit.graphql(userHistoryQuery, { username });
    const {
      totalCommitContributions,
      totalIssueContributions,
      totalPullRequestContributions,
      totalPullRequestReviewContributions,
      totalRepositoryContributions,
    } = response.contributionsCollection;

    const { colors, weeks } = response.contributionsCollection.contributionCalendar;
    let [continuosCount, maxContinuosCount] = [0, 0];
    const contributionHistory = weeks.reduce((acc, week) => {
      week.contributionDays.forEach((day) => {
        acc[day.date] = { count: day.contributionCount, level: colors.indexOf(day.color) + 1 };
        if (day.contributionCount !== 0) {
          maxContinuosCount = Math.max(++continuosCount, maxContinuosCount);
        } else {
          continuosCount = 0;
        }
      });
      return acc;
    }, {});

    const { stargazerCount, forkCount } = response.repositories.nodes.reduce(
      (acc, cur) => {
        acc.stargazerCount += cur.stargazerCount;
        acc.forkCount += cur.forkCount;
        return acc;
      },
      { stargazerCount: 0, forkCount: 0 },
    );
    return {
      totalCommitContributions,
      totalIssueContributions,
      totalPullRequestContributions,
      totalPullRequestReviewContributions,
      totalRepositoryContributions,
      stargazerCount,
      forkCount,
      maxContinuosCount,
      contributionHistory,
    };
  }

  async getUserOrganizationAndPinnedRepositories(
    username: string,
    octokit: Octokit,
  ): Promise<{ organizations: OrganizationDto[]; pinnedRepositories: PinnedRepositoryDto[] }> {
    const response: any = await octokit.graphql(pinnedRepositoriesQuery, {
      username,
    });
    const organizations = response.user.organizations.nodes;
    const pinnedRepositories = response.user.pinnedItems.nodes;
    return {
      organizations: organizations,
      pinnedRepositories: pinnedRepositories.map((repo) => {
        repo.languages = repo.languages.nodes.map((lang) => lang.name);
        return repo;
      }),
    };
  }

  async getUserRelativeRanking(user: UserDto): Promise<Rank> {
    const cachedRanks = await this.userRepository.findCachedUserRank(user.id + '&');
    if (Object.keys(cachedRanks).length) {
      return cachedRanks;
    }
    const users = await this.userRepository.findAll({}, true, ['username', 'tier', 'score']);
    let tierRank = 0;
    for (let rank = 0; rank < users.length; rank++) {
      if (users[rank].username === user.username) {
        const rankInfo = {
          totalRank: rank + 1,
          tierRank: tierRank + 1,
        };
        this.userRepository.setCachedUserRank(user.id + '&', rankInfo);
        return rankInfo;
      }
      if (users[rank].tier === user.tier) {
        tierRank += 1;
      }
    }
  }
}
