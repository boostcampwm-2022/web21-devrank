import { Repository, RepositoryScheme } from '@apps/user/repository.schema';
import { UserModule } from '@apps/user/user.module';
import { UserRepository } from '@apps/user/user.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserScheme } from '../user/user.schema';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      { name: Repository.name, schema: RepositoryScheme },
    ]),
    UserModule,
  ],
  controllers: [RankingController],
  providers: [RankingService, UserRepository],
  exports: [RankingService],
})
export class RankingModule {}
