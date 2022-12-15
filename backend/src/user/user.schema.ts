import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { History } from './dto/history.dto';
import { OrganizationDto } from './dto/organization.dto';
import { PinnedRepositoryDto } from './dto/pinned-repository.dto';

const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  lowerUsername: string;

  @Prop({ required: true })
  following: number;

  @Prop({ required: true })
  followers: number;

  @Prop({ default: 0 })
  commitsScore: number;

  @Prop({ default: 0 })
  followersScore: number;

  @Prop({ default: 0 })
  issuesScore: number;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  dailyViews: number;

  @Prop({ default: 0 })
  scoreDifference: number;

  @Prop({ default: 'default-image-path' })
  avatarUrl: string;

  @Prop({ default: 'yellow' })
  tier: string;

  @Prop()
  name: string;

  @Prop()
  company: string;

  @Prop()
  blogUrl: string;

  @Prop()
  location: string;

  @Prop()
  email: string;

  @Prop()
  bio: string;

  @Prop()
  history: History;

  @Prop()
  pinnedRepositories: PinnedRepositoryDto[];

  @Prop()
  organizations: OrganizationDto[];

  @Prop()
  primaryLanguages: string[];

  @Prop({ default: [] })
  scoreHistory: { date: Date; score: number }[];
}

export const UserScheme = SchemaFactory.createForClass(User);

UserScheme.index({ score: -1 });
UserScheme.index({ scoreDifference: -1 });
UserScheme.index({ dailyViews: -1 });
UserScheme.index({ lowerUsername: 1, score: -1 });
UserScheme.index({ score: -1, lowerUsername: 1 });
UserScheme.index({ tier: 1, lowerUsername: 1, score: -1 });
