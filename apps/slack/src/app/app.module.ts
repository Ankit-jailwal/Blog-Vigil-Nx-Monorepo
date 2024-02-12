import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getGlobalConfig } from '@article-workspace/env';
import { TokenSchema, getMongooseDbCongif } from '@article-workspace/data';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    getGlobalConfig(),
    getMongooseDbCongif(),
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
