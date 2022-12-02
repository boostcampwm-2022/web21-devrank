import { CUBE_RANK } from '@utils/constants';

export type CubeRankType = typeof CUBE_RANK[keyof typeof CUBE_RANK];

export type RANK = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow' | 'mint';

export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

export type ClickEvent = React.MouseEvent<HTMLElement>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type FormEvent = React.FormEvent<HTMLFormElement>;

export type CommitLevelType = 0 | 1 | 2 | 3 | 4;
export interface PinnedRepositoryType {
  name: string;
  url: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  languages: string[];
}
export interface DailyInfo {
  count: number;
  level: CommitLevelType;
}

export interface HistoryType {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoryContributions: number;
  stargazerCount: number;
  forkCount: number;
  maxContinuosCount: number;
  contributionHistory: { [key: string]: DailyInfo };
}

export interface OrganizationType {
  name: string;
  url: string;
  avatarUrl: string;
}
