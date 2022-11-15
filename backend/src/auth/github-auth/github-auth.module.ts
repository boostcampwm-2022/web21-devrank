import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GithubAuthStrategy } from './github-auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [GithubAuthStrategy],
})
export class GithubAuthModule {}
