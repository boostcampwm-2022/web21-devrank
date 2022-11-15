import { Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GithubAuthGuard } from './github-auth/github-auth.guard';
import { AuthUser, ReqGithubProfile } from './auth.decorator';
import { AuthService } from './auth.service';
import { GithubProfile } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary: '깃허브 로그인',
    description: `
      로그인이 되어있지 않은경우, 깃허브 로그인 페이지로 이동합니다
      깃허브 로그인이 끝나면 지정된 프론트 페이지로 이동합니다.`,
  })
  @ApiOkResponse({ description: '깃허브 페이지' })
  githubLogin(): void {
    return;
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Github OAuth Callback' })
  @ApiOkResponse({ description: '로그인한 성공' })
  async githubCallback(
    @ReqGithubProfile() githubProfile: GithubProfile,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(githubProfile);
    const accessToken = this.authService.issueAccessToken(user.id);
    const refreshToken = this.authService.issueRefreshToken(user.id);
    const cookieOption = this.authService.getCookieOption();

    response.cookie(this.configService.get('REFRESH_TOKEN_KEY'), refreshToken, cookieOption);
    return { accessToken };
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiOkResponse({ description: '토큰 재발급 성공' })
  // TODO: 함수 반환 타입을 어떻게 처리해야할지 모르겠음
  async refresh(@Req() request: Request) {
    const refreshToken = this.authService.extractRefreshToken(request);
    const accessToken = this.authService.refreshNewToken(refreshToken);
    return { accessToken };
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공' })
  logout(@Res({ passthrough: true }) response: Response): void {
    const cookieOption = this.authService.getCookieOption();

    response.clearCookie(this.configService.get('REFRESH_TOKEN_KEY'), cookieOption);
  }
}
