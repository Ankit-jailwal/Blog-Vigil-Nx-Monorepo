/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const port = process.env.PORT || 3030;
  await app.listen(port);
  Logger.log(
    `🚀 Auth service is running on: http://localhost:${port}/auth`
  );
}

bootstrap();
