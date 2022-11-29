export interface GithubProfile {
  node_id: string;
  login: string;
  following: number;
  followers: number;
  avatar_url?: string;
  name?: string;
  company?: string;
  blog?: string;
  location?: string;
  email?: string;
  bio?: string;
}
