import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryRepository } from './repository.repository';
import { Repository, RepositoryScheme } from './repository.schema';
import { RepositoryService } from './repository.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User, UserScheme } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      { name: Repository.name, schema: RepositoryScheme },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, RepositoryService, RepositoryRepository],
  exports: [UserService],
})
export class UserModule {}
