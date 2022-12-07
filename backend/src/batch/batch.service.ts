import { logger } from '@libs/utils';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Cron('0 0 0 * * *', { name: 'cronTask' })
  handleCron() {
    logger.log('Task Called');
    this.userService.dailyUpdateAllUsers(this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN'));
    logger.log('Task Finished');
  }
}
