import { User } from '@apps/user/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { GithubProfile, JwtPayload } from './types';

export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {}

  async login(githubProfile: GithubProfile): Promise<User> {
    const user = await this.userService.findOneByGithubId(githubProfile.id);

    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.id = githubProfile.id;
    newUser.username = githubProfile.username;
    newUser.following = githubProfile.following;
    newUser.followers = githubProfile.followers;
    newUser.avatarUrl = githubProfile.avatarUrl;
    newUser.name = githubProfile.name;
    newUser.email = githubProfile.email;
    newUser.bio = githubProfile.bio;
    newUser.company = githubProfile.company;
    newUser.location = githubProfile.location;
    newUser.blogUrl = githubProfile.blogUrl;

    return await this.userService.create(newUser);
  }

  refreshNewToken(refreshToken: string): string {
    try {
      const { id } = jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET')) as JwtPayload;
      return this.issueAccessToken(id);
    } catch {
      throw new UnauthorizedException({ message: 'invalid token.' });
    }
  }

  issueAccessToken(id: number): string {
    return jwt.sign({ id }, this.configService.get('JWT_ACCESS_SECRET'), {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });
  }

  issueRefreshToken(id: number) {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
  }

  extractRefreshToken(request: Request) {
    return request?.cookies?.[this.configService.get('REFRESH_TOKEN_KEY')];
  }

  checkRefreshToken(refreshToken: string) {
    try {
      jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET'));
    } catch {
      return false;
    }
    return true;
  }

  getCookieOption = (): CookieOptions => {
    const oneHour = 60 * 60 * 1000;
    const maxAge = 7 * 24 * oneHour; // 7days

    if (this.configService.get('NODE_ENV') === 'prod') {
      return { httpOnly: true, secure: true, sameSite: 'lax', maxAge };
    } else if (this.configService.get('NODE_ENV') === 'alpha') {
      return { httpOnly: true, secure: true, sameSite: 'none', maxAge };
    }

    return { httpOnly: true, maxAge };
  };
}
