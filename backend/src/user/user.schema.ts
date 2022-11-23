import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsArray, IsEmail, IsInt, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class User extends Document {
  @Prop({ required: true })
  @IsInt()
  id: string;

  @Prop({ required: true })
  @IsString()
  username: string;

  @Prop({ required: true })
  @IsInt()
  following: number;

  @Prop({ required: true })
  @IsInt()
  followers: number;

  @Prop({ required: true })
  @IsNumber()
  commitsScore: number;

  @Prop({ required: true })
  @IsNumber()
  followersScore: number;

  @Prop({ default: 0 })
  @IsInt()
  views: number;

  @Prop({ default: 0 })
  @IsNumber()
  scoreDifference: number;

  @Prop({ default: 'default-image-path' })
  @IsString()
  avatarUrl: string;

  @Prop()
  @IsString()
  name: string;

  @Prop()
  @IsString()
  company: string;

  @Prop()
  @IsString()
  blogUrl: string;

  @Prop()
  @IsString()
  location: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  @IsString()
  bio: string;

  @IsArray()
  repositories: number[];
  // Github API를 통해 계산된 정보 (for Ranking)
}

// 점수계산 : followers, 최근 commit 이력들 * repo크기 가중치
/**
 * repo 크기를 결정해줄 요소들
 */
export class UserRank extends Document {}

// class to scheme
export const UserScheme = SchemaFactory.createForClass(User);
