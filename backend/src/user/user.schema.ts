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
  @IsInt()
  commitsScore: number;

  @Prop({ required: true })
  @IsInt()
  followersScore: number;

  @Prop({ required: true })
  @IsInt()
  issuesScore: number;

  @Prop({ required: true })
  @IsInt()
  score: number;

  @Prop({ default: 0 })
  @IsInt()
  dailyViews: number;

  @Prop({ default: 0 })
  @IsNumber()
  scoreDifference: number;

  @Prop({ default: 'default-image-path' })
  @IsString()
  avatarUrl: string;

  @Prop()
  @IsString()
  tier: string;

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

  @Prop()
  @IsArray()
  primaryLanguages: string[];
}

export const UserScheme = SchemaFactory.createForClass(User);

UserScheme.index({ score: -1 });
UserScheme.index({ scoreDifference: -1 });
UserScheme.index({ dailyViews: -1 });
UserScheme.index({ username: 1, score: 1 });
UserScheme.index({ tier: 1, username: 1, score: 1 });
