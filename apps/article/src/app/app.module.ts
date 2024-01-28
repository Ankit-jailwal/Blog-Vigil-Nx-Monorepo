import { Module } from '@nestjs/common';
import { ArticleService } from './app.service';
import { ArticleController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema, getMongooseDbCongif } from '@article-workspace/data';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateModule } from '@article-workspace/authenticate';
import { HttpsService } from '@article-workspace/https';
import { HttpsModule } from '@article-workspace/https';

@Module({
  imports: [
    AuthenticateModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    getMongooseDbCongif(),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    ArticleModule,
    HttpsModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, HttpsService],
})
export class ArticleModule {}
