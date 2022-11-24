export interface LoginResponse {
  id: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
}

export interface RankingResponse {
  id: string;
  username: string;
  avatarUrl: string;
  dailyViews: number;
  score: number;
  scoreDifference: number;
}
