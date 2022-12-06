import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [BatchService],
})
export class BatchModule {}
