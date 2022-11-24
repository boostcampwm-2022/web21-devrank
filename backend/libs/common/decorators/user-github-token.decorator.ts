import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export const UserGithubToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const accessToken = request.headers?.authorization?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const payload = jwt.decode(accessToken) as jwt.JwtPayload;
  return payload?.githubToken;
});
