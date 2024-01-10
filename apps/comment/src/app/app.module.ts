import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from '@article-workspace/data';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateModule } from '@article-workspace/authenticate';

@Module({
  imports: [
    AuthenticateModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forRoot('mongodb://mongodb', {
      dbName: 'articledbnx',
    }),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
