import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class Repository extends Document {
  // 필수 정보
  @Prop({ required: true })
  @IsInt()
  id: number;

  @Prop({ required: true })
  @IsString()
  owner: string;

  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true })
  @IsInt()
  stargazers_count: number;

  @Prop({ required: true })
  @IsInt()
  forks_count: number;

  @IsNumber()
  score: number;
}

// class to scheme
export const RepositoryScheme = SchemaFactory.createForClass(Repository);
