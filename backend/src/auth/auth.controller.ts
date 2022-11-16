import { UserDto } from '@apps/user/dto/user.dto';
import { UserService } from '@apps/user/user.service';
import { BadRequestException, Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GithubProfile } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '깃허브 로그인',
    description: `
      클라이언트로부터 authCode를 받고 github accessToken을 얻어온 후, 정보를 받아와서 refresh token을 쿠키로 설정한 후 access token을 반환한다`,
  })
  @ApiOkResponse({ description: '로그인 성공' })
  async githubLogin(@Res() response: Response, @Body('code') code: string): Promise<void> {
    if (!code) {
      throw new BadRequestException('need authCode.');
    }
    const githubToken = await this.authService.getGithubToken(code);
    const userInfo: GithubProfile = await this.authService.getGithubProfile(githubToken);
    const user: UserDto = {
      id: userInfo.node_id,
      username: userInfo.login,
      following: userInfo.following,
      followers: userInfo.followers,
      avatarUrl: userInfo.avatar_url,
      name: userInfo.name,
      company: userInfo.company,
      blogUrl: userInfo.blog,
      location: userInfo.location,
      bio: userInfo.bio,
      email: userInfo.email,
    };
    await this.userService.createOrUpdate(user);

    const accessToken = this.authService.issueAccessToken(user.id);
    const refreshToken = this.authService.issueRefreshToken(user.id);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    const cookieOption = this.authService.getCookieOption();

    response.cookie(this.configService.get('REFRESH_TOKEN_KEY'), refreshToken, cookieOption).json({ accessToken });
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiOkResponse({ description: '토큰 재발급 성공' })
  async refresh(@Req() request: Request, @Res() response: Response): Promise<void> {
    const refreshToken = this.authService.extractRefreshToken(request);
    const { id } = this.authService.checkRefreshToken(refreshToken);

    const newRefreshToken = await this.authService.replaceRefreshToken(id, refreshToken);
    const accessToken = this.authService.issueAccessToken(id);
    const cookieOption = this.authService.getCookieOption();

    response.cookie(this.configService.get('REFRESH_TOKEN_KEY'), newRefreshToken, cookieOption).json({ accessToken });
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공' })
  logout(@Res({ passthrough: true }) response: Response): void {
    const cookieOption = this.authService.getCookieOption();
    response.clearCookie(this.configService.get('REFRESH_TOKEN_KEY'), cookieOption);
  }
}
