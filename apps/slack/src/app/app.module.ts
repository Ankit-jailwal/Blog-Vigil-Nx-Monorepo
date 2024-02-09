import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getGlobalConfig } from '@article-workspace/env';

@Module({
  imports: [
    getGlobalConfig()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
