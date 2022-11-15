import { UserModule } from '@apps/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './jwt-auth.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [JwtAuthStrategy],
})
export class JwtAuthModule {}
