import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// guard 쓸 곳이 있나?
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
