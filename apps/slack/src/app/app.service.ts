import { ArticleStatus } from '@article-workspace/enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly ARTICLE_SERVICE = process.env.ARTICLE_SERVICE;
  health(): { message: string } {
    return { message: 'Slack service is up and running' };
  }

  private async getUpdatedBlocks(data: any, actionId: string) {
    const blocks = data.message.blocks;
    let approve = false;
    if (actionId == 'approve_button') approve = true;
    blocks[0].text.text = `Article ${
      approve
        ? ArticleStatus.VERIFIED + ' :white_check_mark:'
        : ArticleStatus.REJECTED + ' :x:'
    }`;
    blocks[2].fields[0].text = `Updated at:\n${new Date().toLocaleTimeString(
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

    blocks.splice(3, 1);

    return blocks;
  }

  async handleSlackInteraction(payload) {
    const data = JSON.parse(payload.payload);
    const action = JSON.parse(data.actions[0].value);
    const articleID = action.id;
    const actionID = data.actions[0].action_id;
    const slackOpenIdUrl = `${process.env.SLACK_OPENID_BASE}response_type=${process.env.SLACK_RESPONSE_TYPE}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${process.env.SLACK_REDIRECT_URI}&scope=${process.env.SLACK_SCOPE}`
    console.log(slackOpenIdUrl);
    const res = await axios.get(slackOpenIdUrl);

    console.log("Response from redirect ",res);
    try {
      let status;
      if(actionID == 'approve_button')
         status = ArticleStatus.VERIFIED;
      else if(actionID == 'reject_button')
        status = ArticleStatus.REJECTED;
      else 
        throw new BadRequestException('Unknown article status');

      const res = await axios.patch(this.ARTICLE_SERVICE + `/${articleID}`, 
      {
        status: status,
      });
      if (!res) throw new BadRequestException('Cannot update article status');

      const blocks = await this.getUpdatedBlocks(data, actionID);
      const response = await axios.post(data.response_url, {
        replace_original: true,
        blocks: blocks,
        text: 'Article Status Updated',
      });

      console.log("Unique identifier for response url",response);
    } catch (error) {
      throw new BadRequestException('Could not update article status');
    }
    console.log(actionID);
    return true;
  }
}
