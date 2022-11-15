export interface GithubProfile {
  id: number;
  username: string;
  following?: number;
  followers?: number;
  avatarUrl?: string;
  name?: string;
  email?: string;
  bio?: string;
  company?: string;
  location?: string;
  blogUrl?: string;
}

export interface JwtPayload {
  id: number;
}
