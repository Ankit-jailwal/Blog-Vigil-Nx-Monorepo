import { Token } from '@article-workspace/data';
import { ArticleStatus } from '@article-workspace/enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: mongoose.Model<Token>
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
    blocks[2].fields[0].text = `*Updated at:*\n${new Date().toLocaleTimeString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
    })}`;
    blocks[2].fields.push({
      type: "mrkdwn",
      text: `*Updated by:*\n <@${uid}>`
    });
    blocks.splice(3, 1);
    return blocks;
  }

  private async sendThreadMessage(data: any, payload: any) {
    const responseUrl = data.response_url;
    const response = await axios.post(responseUrl, payload);
    console.log(response);
  }

  private async updateMessage(blocks: any, responseUrl: string, message: string = 'Article Status Updated') {
    const response = await axios.post(responseUrl, {
      replace_original: true,
      blocks: blocks,
      text: message,
    });
    console.log('Unique identifier for response url', response);
  }

  async handleSlackInteraction(payload: any, req: any) {
    const data = JSON.parse(payload.payload);
    const action = JSON.parse(data.actions[0].value);
    const actionID = data.actions[0].action_id;

    if (actionID === 'auth_button') return true;
    const articleID = action.id;

    try {
      let status;
      if (actionID === 'approve_button') status = ArticleStatus.VERIFIED;
      else if (actionID === 'reject_button') status = ArticleStatus.REJECTED;
      else throw new BadRequestException('Unknown article status');

      const userSecret = await this.tokenModel.findOne({
        slackid: data.user.id,
      });

      if (!userSecret) {
        const blocks = await this.getAuthBlocks(data);
        await this.updateMessage(blocks, data.response_url);
        return true;
      }

      const headers = {
        Authorization: `Bearer ${userSecret.token}`,
        'Content-Type': 'application/json',
      };

      const articleStatus = {
        status: status,
      };
      const res = await axios.patch(
        `${this.ARTICLE_SERVICE}/${articleID}`,
        articleStatus,
        { headers: headers }
      );
      if (!res) throw new BadRequestException('Cannot update article status');

      const blocks = await this.getStatusBlocks(data, actionID);
      await this.updateMessage(blocks, data.response_url);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not update article status');
    }
    return true;
  }

  private async getAuthBlocks(data: any) {
    const blocks = data.message.blocks;
    blocks[3].elements.push({
      type: 'button',
      text: {
        type: 'plain_text',
        emoji: true,
        text: 'Authorize',
      },
      style: 'primary',
      url: this.SLACK_OPENID,
      action_id: 'auth_button',
    });
    return blocks;
  }

  private async getApiStatusBlocks(data: any) {
    const blocks = data.message.blocks;
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Authorize*',
        verbatim: true,
        style: 'danger',
      },
    });
  }
}
