import { Module } from '@nestjs/common';
import { ArticleService } from './app.service';
import { ArticleController } from './app.controller';
// import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from '@article-workspace/data';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateModule } from '@article-workspace/authenticate'

@Module({
  imports: [
    AuthenticateModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forRoot('mongodb://mongodb', {
      dbName: 'articledbnx',
    }),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    ArticleModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
