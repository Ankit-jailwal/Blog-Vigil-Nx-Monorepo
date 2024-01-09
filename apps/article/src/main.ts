/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ArticleModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ArticleModule);
  const port = process.env.PORT || 3010;
  await app.listen(port);
  Logger.log(
    `🚀 Article Service is running on: http://localhost:${port}/article`
  );
}

bootstrap();
