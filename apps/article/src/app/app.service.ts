import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Article } from '@article-workspace/data';
import { User } from '@article-workspace/data';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: mongoose.Model<Article>,
  ) {}

  async findAll(query: {
    page?: number;
    keyword?: string;
  }): Promise<Article[]> {
    const resPerPage = 2;
    const currentPage = query.page ? query.page : 1;
    const skip = resPerPage * (currentPage - 1);

    const keywordFilter = query.keyword
      ? {
          title: {
            $regex: new RegExp(query.keyword, 'i'),
          },
        }
      : {};

    const articles = await this.articleModel
      .find({ ...keywordFilter })
      .limit(resPerPage)
      .skip(skip)
      .exec();

    return articles;
  }

  async create(article: Article, user: User): Promise<Article> {
    console.log(article)
    try {
      const data = Object.assign(article, { user: user._id });
      const res = await this.articleModel.create(data);
      return res;
    } catch (error) {
      throw new Error('Failed to create the article');
    }
  }

  async findById(id: string): Promise<Article> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const article = await this.articleModel.findById(id);

    if (!article) {
      throw new NotFoundException('Article not found.');
    }

    return article;
  }

  async updateById(id: string, article: Article): Promise<Article> {
    return await this.articleModel.findByIdAndUpdate(id, article, {
      new: true,
      runValidators: true,
    });
  }

  async deleteArticle(articleId: string, userId: string): Promise<string> {
    try {
      const article = await this.articleModel.findById(articleId);

      if (!article) {
        throw new Error('Article not found');
      }

      if (article.user.toString() !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to delete this article',
        );
      }

      await this.articleModel.findByIdAndDelete(articleId);

      return 'Article deleted';
    } catch (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
  }
}
