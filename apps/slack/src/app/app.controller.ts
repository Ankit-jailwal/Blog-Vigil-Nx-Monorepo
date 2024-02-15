import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { slackRequestVerification } from '@article-workspace/authentication';

@Controller('slack')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthStatus() {
    return this.appService.health();
  }

  @Post('button')
  onButtonClicked(@Body() body: any, @Req() req: any) {
    const res = slackRequestVerification(body.payload, req);

    console.log(res);
    return this.appService.handleSlackInteraction(body ,req);
  }

  @Post('event')
  onEventTriggered(@Body() payload: any , @Req() req: any) {
      console.log("Body: ", payload);
      
      return payload.challenge;
      return this.appService.handleSlackEvents(req.body);
  }
}
