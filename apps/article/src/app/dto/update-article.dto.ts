import {
    IsEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
import { User } from '@article-workspace/data';

export class UpdateArticleDto {
    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsOptional()
    @IsString()
    readonly image: string;

    @IsOptional()
    @IsString()
    readonly author: string;

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;
}
