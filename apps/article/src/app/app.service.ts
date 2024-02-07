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
import { HttpsService } from '@article-workspace/https'
import axios from 'axios';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: mongoose.Model<Article>,
    private readonly httpService : HttpsService
  ) {}
  private readonly SLACK_ALERT = 'https://hooks.slack.com/services/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';

  async sendSlackAlert(article: any) {
    const payload = {
      username: 'Artcle slack alert',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Article created*: ${article.title}`,
          },
          accessory: {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Verify',
                },
                action_id: 'verify_click', // This ID will be sent when button 1 is clicked // You can pass any additional data you need
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Reject',
                },
                action_id: 'reject_click', // This ID will be sent when button 2 is clicked// You can pass any additional data you need
              },
            ],
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Content* : \n${article.content}`,
            },
            {
              type: 'mrkdwn',
              text: `*Author* : \n${article.author}`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Created at* :\n${new Date().toLocaleTimeString([], {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Kolkata',
              })}`,
            },
            {
              type: 'mrkdwn',
              text: `*Created by* : ${article.user}`,
            },
          ],
        },
        
      ],
    };
    const res = axios.post(this.SLACK_ALERT, payload);
    console.log("Response of slack webhook", res);
  }


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
      const data = Object.assign(article, { user: user._id, author: user.name });
      const res = await this.articleModel.create(data);
      console.log({res}, 'Sending slack alert via Webhook');
      await this.sendSlackAlert(res);
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

    const comments = await this.httpService.getAllComments(id);

    console.log(comments)
    if(comments)
      return Object.assign(article, {comments: comments})

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
