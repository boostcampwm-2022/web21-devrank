import { EXPIRATION } from '@libs/const';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CookieOptions } from 'express';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { GithubProfile } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository, private readonly configService: ConfigService) {}

  async getGithubToken(code: string): Promise<string> {
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: this.configService.get('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    if (!data?.access_token) {
      throw new BadRequestException('invalid authCode.');
    }
    return data.access_token;
  }

  async getGithubProfile(githubToken: string): Promise<GithubProfile> {
    const { data: userInfo } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });
    return userInfo;
  }

  issueAccessToken(id: string, githubToken: string): string {
    return jwt.sign({ id, githubToken }, this.configService.get('JWT_ACCESS_SECRET'), {
      expiresIn: EXPIRATION.ACCESS_TOKEN,
    });
  }

  issueRefreshToken(id: string, githubToken: string): string {
    return jwt.sign({ id, githubToken }, this.configService.get('JWT_REFRESH_SECRET'), {
      expiresIn: EXPIRATION.REFRESH_TOKEN,
    });
  }

  extractRefreshToken(request: Request): string | undefined {
    return request.cookies?.[this.configService.get('REFRESH_TOKEN_KEY')];
  }

  checkRefreshToken(refreshToken: string): jwt.JwtPayload {
    try {
      return jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET')) as jwt.JwtPayload;
    } catch {
      throw new UnauthorizedException('invalid token.');
    }
  }

  async saveRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.authRepository.create(id, refreshToken);
  }

  async replaceRefreshToken(id: string, refreshToken: string, githubToken: string): Promise<string> {
    const storedRefreshToken = await this.authRepository.findRefreshTokenById(id);
    if (refreshToken !== storedRefreshToken) {
      throw new UnauthorizedException('invalid token.');
    }
    const newRefreshToken = this.issueRefreshToken(id, githubToken);
    await this.authRepository.create(id, newRefreshToken);
    return newRefreshToken;
  }

  async deleteRefreshToken(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }

  getCookieOption = (): CookieOptions => {
    const maxAge = EXPIRATION.REFRESH_TOKEN * 1000;

    if (this.configService.get('NODE_ENV') === 'prod') {
      return { httpOnly: true, secure: true, sameSite: 'lax', maxAge };
    } else if (this.configService.get('NODE_ENV') === 'alpha') {
      return { httpOnly: true, secure: true, sameSite: 'none', maxAge };
    }

    return { httpOnly: true, maxAge };
  };
}
