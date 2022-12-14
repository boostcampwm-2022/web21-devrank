import { UserDto } from '@apps/user/dto/user.dto';
import { UserService } from '@apps/user/user.service';
import { CurrentUser } from '@libs/common/decorators/current-user.decodator';
import { BadRequestException, Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response-dto';
import { RefreshGuard } from './guards/refresh-auth.guard';
import { AuthService } from './auth.service';
import { Payload } from './types';
import { GithubProfile } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @ApiOperation({ summary: '깃허브 로그인 페이지' })
  @ApiOkResponse({ status: 302, description: '로그인이 되어있지 않은 경우, 깃허브 로그인 페이지로 이동합니다.' })
  github(@Res() response: Response): void {
    const scope = {
      read: 'user',
    };
    response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${this.configService.get(
        'GITHUB_CLIENT_ID',
      )}&${new URLSearchParams(scope).toString()}`,
    );
  }

  @Post('login')
  @ApiOperation({
    summary: '깃허브 로그인',
    description:
      '클라이언트로부터 authCode를 받고 github accessToken을 얻어온 후, 정보를 받아와서 refresh token을 쿠키로 설정한 후 access token을 반환한다',
  })
  @ApiOkResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  async githubLogin(@Res() response: Response, @Body() body: LoginRequestDto): Promise<void> {
    const code = body?.code;
    if (!code) {
      throw new BadRequestException('need authCode.');
    }
    const githubToken = await this.authService.getGithubToken(code);
    const userInfo: GithubProfile = await this.authService.getGithubProfile(githubToken);
    let user: UserDto = {
      id: userInfo.node_id,
      username: userInfo.login,
      lowerUsername: userInfo.login.toLowerCase(),
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

    try {
      await this.userService.findOneByFilter({ lowerUsername: user.lowerUsername });
    } catch {
      await this.userService.createOrUpdate(user);
      user = await this.userService.updateUser(user.lowerUsername, githubToken);
      user.scoreHistory.push({ score: user.score, date: new Date() });
      await this.userService.createOrUpdate(user);
    }

    const accessToken = this.authService.issueAccessToken(user.id, githubToken);
    const refreshToken = this.authService.issueRefreshToken(user.id, githubToken);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    const cookieOption = this.authService.getCookieOption();
    const responseData: LoginResponseDto = {
      accessToken,
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    };

    response.cookie(this.configService.get('REFRESH_TOKEN_KEY'), refreshToken, cookieOption).json(responseData);
  }

  @Post('refresh')
  @ApiOperation({
    summary: '토큰 재발급',
    description:
      'cookie에 있는 refresh token을 이용해서 새로운 refresh token을 쿠키로 설정하고, access token과 유저 데이터를 반환',
  })
  @ApiOkResponse({
    status: 200,
    description: '토큰 재발급 성공',
    type: LoginResponseDto,
  })
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUser() currentUser: Payload): Promise<LoginResponseDto> {
    const { id, githubToken, refreshToken } = currentUser;
    await this.authService.checkRefreshToken(refreshToken);
    const accessToken = this.authService.issueAccessToken(id, githubToken);
    const user = await this.userService.findOneByFilter({ id: id });
    const responseData: LoginResponseDto = { accessToken, id, username: user.username, avatarUrl: user.avatarUrl };
    return responseData;
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃', description: '클라이언트에 저장된 쿠키를 삭제하고, Redis에서도 삭제한다' })
  @ApiOkResponse({ description: '로그아웃 성공' })
  @UseGuards(RefreshGuard)
  async logout(@CurrentUser() currentUser: Payload, @Res({ passthrough: true }) response: Response): Promise<void> {
    const { id, githubToken, refreshToken } = currentUser;
    const cookieOption = this.authService.getCookieOption();
    if (refreshToken) {
      await this.authService.deleteRefreshToken(id);
    }
    response.clearCookie(this.configService.get('REFRESH_TOKEN_KEY'), cookieOption);
  }
}
