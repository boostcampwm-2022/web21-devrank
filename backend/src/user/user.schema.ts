import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsInt, IsObject, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};
interface RepositoryItem {
  name: string;
}
@Schema(options)
export class User extends Document {
  // 필수 정보
  @Prop({ required: true })
  @IsInt()
  id: string;

  @Prop({ required: true })
  @IsString()
  username: string; // Github API : login

  @Prop({ required: true })
  @IsInt()
  following: number;

  @Prop({ required: true })
  @IsInt()
  followers: number;

  // 선택적 정보
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

  @Prop()
  @IsObject()
  repositories: RepositoryItem[];
  // Github API를 통해 계산된 정보 (for Ranking)
}

// 점수계산 : followers, 최근 commit 이력들 * repo크기 가중치
/**
 * repo 크기를 결정해줄 요소들
 */
export class UserRank extends Document {}

// class to scheme
export const UserScheme = SchemaFactory.createForClass(User);
