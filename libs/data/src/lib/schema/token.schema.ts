import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Token extends Document {
  @Prop()
  slackid: string;

  @Prop()
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
