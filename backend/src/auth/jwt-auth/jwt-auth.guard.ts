import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super();
  }
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    const request = context.switchToHttp().getRequest<Request>();
    if (err) {
      const refreshToken = this.authService.extractRefreshToken(request);
      if (!refreshToken) {
        throw new UnauthorizedException({ message: 'Refresh token not found. Please make a new signin request.' });
      }
      try {
        jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET'));
      } catch {
        throw new UnauthorizedException({ message: 'Refresh token was expired. Please make a new signin request.' });
      }
      throw new UnauthorizedException({
        message: 'access token is expired. Please reissue using refresh token.',
        retry: true,
      });
    }
    return user;
  }
}
