import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({ message: 'please refresh.', retry: true });
    }
    if (!user) {
      throw new UnauthorizedException({ message: 'invalid access.' });
    }
    return user;
  }
}
