import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class SlackUser {
    @Prop()
    slackId: string;
  
    @Prop()
    email: string

    @Prop()
    channelId: string;

    @Prop()
    workspaceId: string;
  
    @Prop()
    active: boolean;
  };

  export const SlackUserSchema = SchemaFactory.createForClass(SlackUser);