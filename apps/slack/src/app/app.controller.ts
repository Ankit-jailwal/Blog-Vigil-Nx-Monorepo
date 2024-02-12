import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('slack')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthStatus() {
    return this.appService.health();
  }

  @Post('button')
  onButtonClicked(@Body() body: any, @Req() req: any) {
    return this.appService.handleSlackInteraction(body);
  }
}
