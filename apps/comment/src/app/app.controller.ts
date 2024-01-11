import { Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';

import { AppService } from './app.service';
// import { Article } from '@article-workspace/data';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from '@article-workspace/data'

@Controller()
export class AppController {
  constructor(private readonly commentService: AppService) {}

  @Post(':articleId/comment')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('articleId') articleId: string,
    @Body() comment: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.addCommentToArticle(articleId, comment);
  }

  @Get(':articleId/comment')
  async getAllArticles(
    @Param('articleId') articleId: string,
    @Query() query: { page?: number;},
  ): Promise<Comment[]> {
    return this.commentService.findAll(articleId, query);
  }
}
