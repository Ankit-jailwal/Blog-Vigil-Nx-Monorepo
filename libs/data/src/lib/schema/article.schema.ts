import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { ArticleStatus } from '@article-workspace/enum';
// import { Comment } from './comment.schema'

@Schema({
  timestamps: true,
})
export class Article {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  image: string;

  @Prop()
  author: string;

  @Prop({ type: String, enum: Object.values(ArticleStatus), default: ArticleStatus.UNVERIFIED })
  status?: ArticleStatus;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
