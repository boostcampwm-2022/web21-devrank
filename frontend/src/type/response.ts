import { CubeRankType, HistoryType, OrganizationType, PinnedRepositoryType, RANK } from '@type/common';

export interface LoginResponse {
  id: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
}

export interface RankingResponse {
  id: string;
  tier: CubeRankType;
  username: string;
  avatarUrl: string;
  dailyViews: number;
  score: number;
  scoreDifference: number;
  primaryLanguages: string[];
}

export interface PageRange {
  left: number;
  right: number;
}
export interface RankingMeta {
  total: number;
  limit: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  range: PageRange;
  left: boolean;
  right: boolean;
}

export interface RankingPaiginationResponse {
  metadata: RankingMeta;
  users: RankingResponse[];
}

export interface ProgrammingLanguageRankingResponse {
  language: string;
  count: number;
}

export interface ProfileUserResponse {
  id: string;
  username: string;
  following: number;
  followers: number;
  commitsScore: number;
  issuesScore: number;
  followersScore: number;
  score: number;
  tier: RANK;
  avatarUrl: string;
  name: string;
  company: string;
  blogUrl: string;
  location: string;
  bio: string;
  email: string;
  dailyViews: number;
  scoreDifference: number;
  updateDelayTime: number;
  primaryLanguages: [string];
  history: HistoryType;
  pinnedRepositories: PinnedRepositoryType[];
  organizations: OrganizationType[];
  totalRank: number;
  tierRank: number;
}
