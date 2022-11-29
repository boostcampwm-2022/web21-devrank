import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from '../types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(readonly configService: ConfigService, readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return authService.extractRefreshToken(request);
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: Payload): Payload {
    const refreshToken = this.authService.extractRefreshToken(request);
    return { refreshToken, ...payload };
  }
}
