import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  handleRequest<TUser>(err: any, user: any, info: any, context: any, status?: any): TUser {
    try {
      return super.handleRequest(err, user, info, context, status);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
