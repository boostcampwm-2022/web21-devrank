import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/user.repository';

export interface JwtPayload {
  sub: string;
  username: string;
}

// PassportStrategy에서 custom error 던지는 방법 찾기
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;
  // if access token expired, client need to call '/refresh'
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  // request.user
  async validate(payload: JwtPayload) {
    return payload;
  }
}
