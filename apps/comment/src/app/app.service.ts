import { CreateCommentDto, Article } from '@article-workspace/data';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: mongoose.Model<Article>,
  ) {}
  

  async addCommentToArticle(
    id: string,
    comment: CreateCommentDto,
  ): Promise<Article> {
    try {
      const article = await this.articleModel.findById(id);

      if (!article) {
        throw new Error('Article not found');
      }

      const newComment = {
        user: comment.user,
        content: comment.content,
        createdAt: new Date(),
      };

      article.comments.push(newComment);
      const updatedArticle = await article.save();

      return updatedArticle;
    } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }
}
