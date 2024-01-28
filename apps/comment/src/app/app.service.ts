import { Article } from '@article-workspace/data';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '@article-workspace/data';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: mongoose.Model<Article>,
    @InjectModel(Comment.name)
    private commentModel: mongoose.Model<Comment>,
  ) {}
  

  async addCommentToArticle(
    id: string,
    comment: CreateCommentDto,
  ): Promise<Comment> {
    try {
      const article = await this.articleModel.findById(id);

      if (!article) {
        throw new Error('Article not found');
      }

      console.log(comment.content);
      const newComment = {
        user: comment.user,
        article: id,
        content: comment.content,
        createdAt: new Date(),
      };

      const res = await this.commentModel.create(newComment);

      return res;
    } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  async findAll(
    id: string,
    query: {
    page?: number;
  }): Promise<Comment[]> {
    const resPerPage = 4;
    const currentPage = query.page ? query.page : 1;
    const skip = resPerPage * (currentPage - 1);

    const comments = await this.commentModel
      .find(
        {
          article: id
        }
      )
      .limit(resPerPage)
      .skip(skip)
      .exec();

    return comments;
  }

}
