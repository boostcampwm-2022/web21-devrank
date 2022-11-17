import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '모든 유저 정보 가져오기' })
  @ApiResponse({ status: 200, description: '모든 유저 정보' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  async findOneByGithubId(@Param('id') id: string): Promise<User> {
    return this.userService.findOneByGithubId(id);
  }

  @Get('update-score/:id')
  @ApiOperation({ summary: '특정 유저의 저장소 점수 업데이트' })
  @ApiResponse({ status: 200, description: '유저 정보' })
  async updateScore(@Param('id') id: string): Promise<UserDto> {
    const githubToken = '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';
    return this.userService.updateScore(id, githubToken);
  }
}
