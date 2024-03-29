import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
import { User } from '@article-workspace/data';
import { ArticleStatus } from '@article-workspace/enum';

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsString()
    readonly image: string;

    @IsEnum(ArticleStatus)
    status: ArticleStatus

    @IsEmpty({message: 'You cannot pass author name'})
    @IsString()
    readonly author: string;

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User
}
