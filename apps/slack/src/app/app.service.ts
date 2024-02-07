import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): { message: string } {
    return { message: 'Slack service is up and running' };
  }

  async handleSlackInteraction(payload: any) {

    
  }
}
