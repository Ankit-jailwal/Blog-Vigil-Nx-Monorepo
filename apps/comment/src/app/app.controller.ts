import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateCommentDto, Article } from '@article-workspace/data';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly commentService: AppService) {}

  @Post(':articleId/comment')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('articleId') articleId: string,
    @Body() comment: CreateCommentDto,
  ): Promise<Article> {
    return this.commentService.addCommentToArticle(articleId, comment);
  }
}
