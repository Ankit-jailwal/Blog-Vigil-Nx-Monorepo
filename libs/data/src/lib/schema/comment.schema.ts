import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Article } from "./article.schema";


@Schema({
  timestamps: true,
})
export class Comment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article' })
    article: Article

    @Prop()
    content: string;
  
    @Prop()
    createdAt: Date;
  };

  export const CommentSchema = SchemaFactory.createForClass(Comment);