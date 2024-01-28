import {
    IsEmpty,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
import { User } from '@article-workspace/data';

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsString()
    readonly image: string;

    @IsEmpty({message: 'You cannot pass author name'})
    @IsString()
    readonly author: string;

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User
}
