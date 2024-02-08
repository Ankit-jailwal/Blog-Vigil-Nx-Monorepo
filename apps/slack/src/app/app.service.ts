import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): { message: string } {
    return { message: 'Slack service is up and running' };
  }

  async handleSlackInteraction(payload) {
    const { type, user, actions, channel } = payload;

    if (type === 'block_actions') {
        const { action_id, value } = actions[0];
        return `Button "${action_id}" clicked by <@${user.id}> in channel ${channel.name} with payload: ${value}`;
    } else {
        return 'Unknown interaction type';
    }
}

}
