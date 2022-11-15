import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    const request = context.switchToHttp().getRequest<Request>();
    //is access token is
    if (err) {
      const refreshToken = request?.cookies?.[this.configService.get('REFRESH_TOKEN_KEY')];
      if (!refreshToken) {
        throw new UnauthorizedException({ message: 'invalid token.' });
      }
      try {
        jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET'));
      } catch {
        throw new UnauthorizedException({ message: 'invalid token.' });
      }
      throw new UnauthorizedException({ message: 'token is expired.', retry: true });
    }
    return user;
  }
}
