import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  id: string;
  githubToken: string;
  refreshToken?: string;
}
