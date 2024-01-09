import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";



export class Comment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
  
    @Prop()
    content: string;
  
    @Prop()
    createdAt: Date;
  };

  export const CommentSchema = SchemaFactory.createForClass(Comment);