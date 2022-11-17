import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from './repository.schema';

@Injectable()
export class RepositoryRepository {
  constructor(@InjectModel('Repository') private readonly repositoryModel: Model<Repository>) {}

  async findAll(): Promise<Repository[]> {
    return this.repositoryModel.find().exec();
  }

  async findOneById(id: number): Promise<Repository> {
    return this.repositoryModel.findOne({ id }).exec();
  }

  async create(repository: Repository): Promise<Repository> {
    const newRepository = new this.repositoryModel(repository);
    return newRepository.save();
  }

  async update(id: number, repository: Repository): Promise<Repository> {
    return this.repositoryModel
      .findOneAndUpdate(
        {
          id,
        },
        repository,
      )
      .exec();
  }
}
