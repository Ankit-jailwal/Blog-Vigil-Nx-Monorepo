import { Module } from '@nestjs/common';
import { Article } from './schema/article.schema';
import { User } from './schema/user.schema';
import { Comment } from './schema/comment.schema';

@Module({
  imports: [
  ],
  providers: [Article, User, Comment],
  exports: [Article, User, Comment]
})
export class MongoModule {}
