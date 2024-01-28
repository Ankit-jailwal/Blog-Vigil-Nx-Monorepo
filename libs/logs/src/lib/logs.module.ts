import { Module } from '@nestjs/common';
import { ArticleLoggerService } from './logs.service';

@Module({
  controllers: [
  ],
  providers: [ArticleLoggerService],
  exports: [ArticleLoggerService],
})
export class ArticleLoggerModule {}
