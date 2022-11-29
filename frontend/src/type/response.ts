import { CubeRankType } from '@type/common';

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
