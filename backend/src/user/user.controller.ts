import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async findOneByGithubId(@Param('id') id: number): Promise<User> {
    return this.userService.findOneByGithubId(id);
  }
}
