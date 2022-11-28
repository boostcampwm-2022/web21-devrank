export class UserDto {
  _id?: string;
  id: string;
  username: string;
  following: number;
  followers: number;
  commitsScore?: number;
  followersScore?: number;
  score?: number;
  tier?: string;
  avatarUrl?: string;
  name?: string;
  company?: string;
  blogUrl?: string;
  location?: string;
  bio?: string;
  email?: string;
  dailyViews?: number;
  scoreDifference?: number;
  updateDelayTime?: number;
  repositories?: number[];
  primaryLanguages?: string[];
}
