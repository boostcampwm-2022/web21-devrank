import { GITHUB_API_DELAY } from '@libs/consts';
import { getNeedExp, getStartExp, getTier, logger } from '@libs/utils';
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

  async findOneByUsername(githubToken: string, ip: string, lowerUsername: string): Promise<UserProfileDto> {
    let user = await this.userRepository.findOneByLowerUsername(lowerUsername);
    if (!user) {
      try {
        user = await this.updateUser(lowerUsername, githubToken);
        if (!user.scoreHistory) {
          user.scoreHistory = [];
        }
        user.scoreHistory.push({ date: new Date(), score: user.score });
        user = await this.userRepository.createOrUpdate(user);
      } catch {
        throw new HttpException(`can't update this user.`, HttpStatus.NO_CONTENT);
      }
    }
    const { totalRank, tierRank } =
      (await this.getUserRelativeRanking(user)) || (await this.setUserRelativeRanking(user));
    if (!(await this.userRepository.isDuplicatedRequestIp(ip, lowerUsername)) && user.history) {
      user.dailyViews += 1;
      await this.userRepository.createOrUpdate(user);
    }
    this.userRepository.setDuplicatedRequestIp(ip, lowerUsername);
    user.updateDelayTime = await this.userRepository.findUpdateScoreTimeToLive(lowerUsername);
    return { ...user, totalRank, tierRank, startExp: getStartExp(user.score), needExp: getNeedExp(user.score) };
  }

  async findAllByPrefixUsername(limit: number, lowerUsername: string): Promise<AutoCompleteDto[]> {
    const users = await this.userRepository.findAllByPrefixLowerUsername(limit, lowerUsername);
    return users.map((user) => new AutoCompleteDto().of(user));
  }

  async updateUser(lowerUsername: string, githubToken: string): Promise<UserProfileDto> {
    let user = await this.getUserInfo(githubToken, lowerUsername);
    user = await this.userRepository.createOrUpdate(user);
    const octokit = new Octokit({
      auth: githubToken,
    });
    const [history, { organizations, pinnedRepositories }] = await Promise.all([
      this.getUserHistory(lowerUsername, octokit),
      this.getUserOrganizationAndPinnedRepositories(lowerUsername, octokit),
    ]);
    const scores = await this.getUserScore(lowerUsername, octokit, history);
    const updatedUser: UserDto = {
      ...user,
      ...scores,
      history,
      organizations,
      pinnedRepositories,
    };
    user = await this.userRepository.createOrUpdate(updatedUser);
    const { totalRank, tierRank } = await this.setUserRelativeRanking(user);
    const userWithRank: UserProfileDto = {
      ...user,
      totalRank,
      tierRank,
      startExp: getStartExp(user.score),
      needExp: getNeedExp(user.score),
    };
    return userWithRank;
  }

  async updateAllUsers(githubToken: string): Promise<void> {
    const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
    const users = await this.userRepository.findAll({}, false, ['lowerUsername']);
    for (const user of users) {
      await sleep(GITHUB_API_DELAY);
      try {
        const updateUser = await this.updateUser(user.lowerUsername, githubToken);
        if (!updateUser.scoreHistory) updateUser.scoreHistory = [];
        if (updateUser.scoreHistory.length) updateUser.scoreHistory.pop();
        updateUser.scoreHistory.push({ date: new Date(), score: updateUser.score });
        if (updateUser.scoreHistory.length > 1) {
          updateUser.scoreDifference =
            updateUser.score - updateUser.scoreHistory[updateUser.scoreHistory.length - 2].score;
        } else {
          updateUser.scoreDifference = 0;
        }
        this.userRepository.createOrUpdate(updateUser);
        this.userRepository.deleteCachedUserRank(updateUser.lowerUsername + '&');
      } catch {
        logger.error(`can't update user ${user.lowerUsername}`);
      }
    }
  }

  async dailyUpdateAllUsers(githubToken: string): Promise<void> {
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    const users = await this.userRepository.findAll({}, false, ['lowerUsername']);
    for (const user of users) {
      await sleep(GITHUB_API_DELAY);
      try {
        await this.updateUser(user.lowerUsername, githubToken);
        const updatedUser = await this.updateUser(user.lowerUsername, githubToken);
        if (!updatedUser.scoreHistory) updatedUser.scoreHistory = [];
        updatedUser.scoreHistory.push({
          date: new Date(),
          score: updatedUser.score,
        });
        if (updatedUser.scoreHistory.length > 1) {
          updatedUser.scoreDifference =
            updatedUser.score - updatedUser.scoreHistory[updatedUser.scoreHistory.length - 2].score;
        } else {
          updatedUser.scoreDifference = 0;
        }
        updatedUser.dailyViews = 0;
        this.userRepository.createOrUpdate(updatedUser);
      } catch {
        logger.error(`can't update user ${user.lowerUsername}`);
      }
    }
  }

  async isDuplicatedRequestIp(ip: string, lowerUsername: string): Promise<boolean> {
    return this.userRepository.isDuplicatedRequestIp(ip, lowerUsername);
  }
  async findUpdateScoreTimeToLive(lowerUsername: string): Promise<number> {
    return this.userRepository.findUpdateScoreTimeToLive(lowerUsername);
  }

  async setUpdateScoreDelayTime(lowerUsername: string, seconds: number): Promise<any> {
    return this.userRepository.setUpdateScoreDelayTime(lowerUsername, seconds);
  }

  async createOrUpdate(user: UserDto): Promise<UserDto> {
    return this.userRepository.createOrUpdate(user);
  }

  async getUserInfo(githubToken: string, lowerUsername: string): Promise<UserDto> {
    const octokit = new Octokit({
      auth: githubToken,
    });
    try {
      const response = await octokit.request('GET /users/{username}', {
        username: lowerUsername,
      });
      if (response.data.type !== 'User') {
        throw new NotFoundException('User not found.');
      }
      const user: UserDto = {
        id: response.data.node_id,
        username: response.data.login,
        lowerUsername: response.data.login.toLowerCase(),
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

  async getUserScore(lowerUsername: string, octokit: Octokit, history: History): Promise<Partial<UserDto>> {
    const res: any = await octokit.request('GET /users/{username}', {
      username: lowerUsername,
    });
    const id = res.data.node_id;

    try {
      const forkResponse: any = await octokit.graphql(forkRepositoryQuery, {
        username: lowerUsername,
        id,
      });

      const personalResponse: any = await octokit.graphql(nonForkRepositoryQuery, {
        username: lowerUsername,
        id,
      });

      const followersResponse: any = await octokit.graphql(followersQuery, {
        username: lowerUsername,
      });

      const issuesResponse: any = await octokit.graphql(issueQuery, {
        username: lowerUsername,
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

      const contributionScore =
        history.totalCommitContributions +
        history.totalIssueContributions +
        history.totalPullRequestContributions +
        history.totalRepositoryContributions +
        history.totalPullRequestReviewContributions;
      const forkScore = forkRepositories.reduce(getCommitScore, 0);
      const followersScore = Math.floor(followersResponse.user.followers.totalCount / 10);
      const personalRepositories = personalResponse.user.repositories.nodes;
      const personalScore = personalRepositories.reduce(getCommitScore, 0);
      const commitsScore = parseInt(forkScore + personalScore) + contributionScore;
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

  async getUserHistory(lowerUsername: string, octokit: Octokit): Promise<History> {
    const { user: response }: any = await octokit.graphql(userHistoryQuery, { username: lowerUsername });
    const {
      totalCommitContributions,
      totalIssueContributions,
      totalPullRequestContributions,
      totalPullRequestReviewContributions,
      totalRepositoryContributions,
    } = response.contributionsCollection;

    const { colors, weeks } = response.contributionsCollection.contributionCalendar;
    let [continuousCount, maxContinuousCount] = [0, 0];
    const contributionHistory = weeks.reduce((acc, week) => {
      week.contributionDays.forEach((day) => {
        acc[day.date] = { count: day.contributionCount, level: colors.indexOf(day.color) + 1 };
        if (day.contributionCount !== 0) {
          maxContinuousCount = Math.max(++continuousCount, maxContinuousCount);
        } else {
          continuousCount = 0;
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
      maxContinuousCount,
      contributionHistory,
    };
  }

  async getUserOrganizationAndPinnedRepositories(
    lowerUsername: string,
    octokit: Octokit,
  ): Promise<{ organizations: OrganizationDto[]; pinnedRepositories: PinnedRepositoryDto[] }> {
    const response: any = await octokit.graphql(pinnedRepositoriesQuery, {
      username: lowerUsername,
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

  async getUserRelativeRanking(user: UserDto): Promise<Rank | false> {
    const cachedRanks = await this.userRepository.findCachedUserRank(user.id + '&');
    if (Object.keys(cachedRanks).length) {
      return cachedRanks;
    }
    return false;
  }

  async setUserRelativeRanking(user: UserDto): Promise<Rank> {
    const users = await this.userRepository.findAll({}, true, ['lowerUsername', 'tier', 'score']);
    let tierRank = 0;
    for (let rank = 0; rank < users.length; rank++) {
      if (users[rank].lowerUsername === user.lowerUsername) {
        const rankInfo = {
          totalRank: rank + 1,
          tierRank: tierRank + 1,
        };
        await this.userRepository.setCachedUserRank(user.id + '&', rankInfo);
        return rankInfo;
      }
      if (users[rank].tier === user.tier) {
        tierRank += 1;
      }
    }
  }
}
