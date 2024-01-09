import { Module } from '@nestjs/common';
// import { CreateArticleDto } from './dto/create-article.dto';
// import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleSchema } from './schema/article.schema';
// import { LoginDto } from './dto/login.dto';
// import { SignUpDto } from './dto/signup.dto';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/articledbnx'),
    MongooseModule.forFeature([{ name: 'Article', schema:  ArticleSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema:  CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema}])
  ],
  providers: [Article, User, Comment, CreateCommentDto, CreateArticleDto, UpdateArticleDto],
  exports: [Article, User, Comment, CreateCommentDto, CreateArticleDto, UpdateArticleDto]
})
export class DataModule {}
