export class UserDto {
  id: string;
  username: string;
  following: number;
  followers: number;
  commitsScore?: number;
  followersScore?: number;
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
}
