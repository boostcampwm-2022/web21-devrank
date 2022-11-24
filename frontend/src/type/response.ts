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
}
