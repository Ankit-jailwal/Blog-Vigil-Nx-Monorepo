import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
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
    console.log(body);
    const res = slackRequestVerification(req);

    console.log(res);
    if (!res) throw new BadGatewayException('Bad request');

    return this.appService.handleSlackInteraction(body, req);
  }

  @Post('event')
  async onEventTriggered(@Body() body: any, @Req() req: any) {
    const res = slackRequestVerification(req);

    if (!res) throw new BadGatewayException('Bad request');

    await this.appService.handleSlackEvents(req.body);
    return body.challenge;
  }
}
