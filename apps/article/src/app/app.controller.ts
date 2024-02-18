import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Article } from '@article-workspace/data'
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async getAllArticles(
    @Query() query: { page?: number; keyword?: string },
  ): Promise<Article[]> {
    return this.articleService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @Body()
    article: CreateArticleDto,
    @Req() req,
  ): Promise<Article> {
    return this.articleService.create(article, req.user);
  }

  @Get(':id')
  async getArticle(
    @Param('id')
    id: string,
  ): Promise<Article> {
    return this.articleService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('id')
    id: string,
    @Body()
    article: UpdateArticleDto,
    @Req() req,
  ): Promise<Article> {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.articleService.updateById(id, article);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard())
  async updateStatus(
    @Param('id')
    id: string,
    @Body()
    body: any,
    @Req() req,
  ): Promise<Article> {
    // const uid = req.user?.id;

    // if(!uid) {
    //   throw new BadRequestException('User not authenticated');
    // }

    return this.articleService.updateArticleStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param('id') articleId: string,
    @Req() req,
  ): Promise<string> {
    const userId = req.user?.id;

    if (!userId) {
      throw Error('User not authenticated');
    }

    return this.articleService.deleteArticle(articleId, userId);
  }
}
