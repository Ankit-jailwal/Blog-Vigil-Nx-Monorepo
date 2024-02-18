import { SlackUser, Token } from '@article-workspace/data';
import { ArticleStatus, MessageType } from '@article-workspace/enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: mongoose.Model<Token>,
    @InjectModel(SlackUser.name)
    private slackUserModel: mongoose.Model<SlackUser>
  ) {}

  private readonly ARTICLE_SERVICE = process.env.ARTICLE_SERVICE;
  private readonly SLACK_OPENID = `${process.env.SLACK_OPENID_BASE}response_type=${process.env.SLACK_RESPONSE_TYPE}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${process.env.SLACK_REDIRECT_URI}&scope=${process.env.SLACK_SCOPE}`;

  health(): { message: string } {
    return { message: 'Slack service is up and running' };
  }

  private async getStatusBlocks(data: any, actionId: string) {
    const blocks = data.message.blocks;
    const uid = data.user.id;
    const approve = actionId === 'approve_button';
    blocks[0].text.text = `Article ${
      approve
        ? ArticleStatus.VERIFIED + ' :white_check_mark:'
        : ArticleStatus.REJECTED + ' :x:'
    }`;
    blocks[2].fields[0].text = `*Updated at:*\n${new Date().toLocaleTimeString(
      [],
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata',
      }
    )}`;
    blocks[2].fields.push({
      type: 'mrkdwn',
      text: `*Updated by:*\n <@${uid}>`,
    });
    blocks.splice(3, 1);
    return blocks;
  }

  async handleSlackEvents(event: any) {
    const userId = event.event.user;
    const channelId = event.event.channel;
    const type = event.event.type;

    if (type === 'member_joined_channel') {
      const user = await this.slackUserModel.findOneAndUpdate(
        { slackId: userId },
        { $set: { active: true } },
        { new: true }
      );

      if (!user) {
        const message = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Hey <@${userId}>, this channel is integrated with Slack Bot which requires user permission to perform actions.`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Grant Access',
                  emoji: true,
                },
                style: 'primary',
                url: process.env.SLACK_OPENID_URL,
                action_id: 'grant_access_button_click',
              },
            ],
          },
        ];

        await this.sendBotMessage(MessageType.BLOCKS, userId, message);
        return true;
      }
      await this.sendBotMessage(
        MessageType.TEXT,
        userId,
        `Hey <@${userId}>, welcome back to watchword verification channel`
      );
      console.log(`User ${userId} joined channel ${channelId}`);
    } else if (
      type === 'member_left_channel' &&
      channelId === process.env.CHANNEL_ID
    ) {
      // Update the user's active status when they leave the channel
      await this.slackUserModel.findOneAndUpdate(
        { slackId: userId },
        { active: false },
        { new: true, upsert: false }
      );
      await this.sendBotMessage(
        MessageType.TEXT,
        userId,
        `Hey <@${userId}>, you were removed from watchword verification channel.`
      );
      console.log(`User ${userId} left channel ${channelId}`);
    }

    return true;
  }

  private async updateMessage(
    blocks: any,
    responseUrl: string,
    message: string = 'Article Status Updated'
  ) {
    const response = await axios.post(responseUrl, {
      replace_original: true,
      blocks: blocks,
      text: message,
    });
    console.log('Unique identifier for response url', response);
  }

  async handleSlackInteraction(payload: any, req: any) {
    const data = JSON.parse(payload.payload);
    const messageTs = data.container.message_ts;
    const channelId = data.container.channel_id;
    try {
      const action = JSON.parse(data.actions[0].value);
      const actionID = data.actions[0].action_id;
      const articleID = action.id;
      let status: ArticleStatus;
      if (actionID === 'approve_button') status = ArticleStatus.VERIFIED;
      else if (actionID === 'reject_button') status = ArticleStatus.REJECTED;
      else throw new BadRequestException('Unknown article status');

      console.log(data.user.id);
      const slackUser = await this.slackUserModel.findOne({
        slackId: data.user.id,
      });

      console.log(slackUser);
      if (!slackUser || !slackUser.active) {
        console.log('User not found');
        const message = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Hey <@${data.user.id}>, this channel is integrated with Slack Bot which requires user permission to perform actions.`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Grant Access',
                  emoji: true,
                },
                style: 'primary',
                url: process.env.SLACK_OPENID_URL,
                action_id: 'grant_access_button_click',
              },
            ],
          },
        ];

        // Send the message to the user
        await this.sendBotMessage(MessageType.BLOCKS, data.user.id, message);
        await this.sendBotMessage(
          MessageType.TEXT,
          channelId,
          `<@${data.user.id}>, you are not authorized to perform this action`,
          messageTs
        );
        return true;
      }

      const articleStatus = {
        status: status,
      };
      console.log(articleID);
      const res = await axios.patch(
        `${this.ARTICLE_SERVICE}/${articleID}`,
        articleStatus
      );

      if (!res) {
        await this.sendBotMessage(
          MessageType.TEXT,
          channelId,
          `<@${data.user.id}>, could not update article`,
          messageTs
        );
        return false;
      }

      const blocks = await this.getStatusBlocks(data, actionID);
      await this.updateMessage(blocks, data.response_url);
      await this.sendBotMessage(
        MessageType.TEXT,
        channelId,
        `${status} by <@${data.user.id}>`,
        messageTs
      );
      return true;
    } catch (error) {
      await this.sendBotMessage(
        MessageType.TEXT,
        channelId,
        `<@${data.user.id}>, ${error}`,
        messageTs
      );
      return false;
    }
  }

  private async sendBotMessage(
    type: MessageType,
    channel_id: string,
    message?: any,
    ts?: string
  ) {
    // const accessToken = await this.getAccessTokenFromRefreshToken();

    // console.log("Access token here", accessToken);
    const CHANNEL_ID = channel_id;

    try {
      const postData: any = {
        channel: CHANNEL_ID,
      };

      postData.thread_ts = ts;
      if (type === MessageType.TEXT) {
        postData.text = message;
      } else if (type === MessageType.BLOCKS) {
        postData.blocks = message;
      }

      const res = await axios.post(process.env.SLACK_MESSAGE_API, postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.SLACK_ACCESS_TOKEN,
        },
      });
      console.log('Message sent successfully:', res.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private async getAccessTokenFromRefreshToken(): Promise<string | null> {
    try {
      const clientId = process.env.SLACK_CLIENT_ID;
      const clientSecret = process.env.SLACK_CLIENT_SECRET;
      const refreshToken = process.env.BOT_REFRESH_TOKEN;
      const response = await axios.post(
        `${process.env.SLACK_OAUTH2_URI}?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok) {
        return response.data.access_token;
      } else {
        console.error('Error refreshing access token:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error.message);
      return null;
    }
  }
}
