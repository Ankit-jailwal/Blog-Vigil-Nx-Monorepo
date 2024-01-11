import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthenticateModule } from '@article-workspace/authenticate'
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema, CommentSchema, getMongooseDbCongif } from '@article-workspace/data';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthenticateModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    getMongooseDbCongif(),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
