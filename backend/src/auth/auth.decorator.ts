import { User } from '@apps/user/user.schema';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GithubProfile } from './types';

/**
 * @description Request에 담긴 User를 가져온다.
 * @note Auth decorator를 써야 사용가능
 */
export const AuthUser = createParamDecorator((data: 'id' | null, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  if (data) return req.user[data];
  return req.user;
});

/**
 * @description Request에 담긴 GithubProfile를 가져온다.
 * @note GithubAuthGuard 를 써야 사용가능
 */
export const ReqGithubProfile = createParamDecorator((data, ctx: ExecutionContext): GithubProfile => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
