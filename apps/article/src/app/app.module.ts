import { Module } from '@nestjs/common';
import { ArticleService } from './app.service';
import { ArticleController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema, getMongooseDbCongif } from '@article-workspace/data';
import { PassportModule } from '@nestjs/passport';
import { HttpsModule, HttpsService } from '@article-workspace/https';
import { AuthenticationModule } from '@article-workspace/authentication';
import { getGlobalConfig } from '@article-workspace/env';

@Module({
  imports: [
    AuthenticationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    getMongooseDbCongif(),
    getGlobalConfig(),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    ArticleModule,
    HttpsModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, HttpsService],
})
export class ArticleModule {}
