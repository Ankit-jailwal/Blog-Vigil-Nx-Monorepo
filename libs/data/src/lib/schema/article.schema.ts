import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
