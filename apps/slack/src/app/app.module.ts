import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getGlobalConfig } from '@article-workspace/env';
import { SlackUserSchema, TokenSchema, getMongooseDbCongif } from '@article-workspace/data';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '@article-workspace/authentication';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';

@Module({
  imports: [
    getGlobalConfig(),
    getMongooseDbCongif(),
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }, { name: 'SlackUser', schema: SlackUserSchema }]),
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
