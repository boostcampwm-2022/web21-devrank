import { UserModule } from '@apps/user/user.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [BatchService],
})
export class BatchModule {}
