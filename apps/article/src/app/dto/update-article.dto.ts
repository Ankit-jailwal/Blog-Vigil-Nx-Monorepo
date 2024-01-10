// import {
//   IsArray,
//     IsEmpty,
//     IsOptional,
//     IsString,
//   } from 'class-validator';
// import { CreateCommentDto } from './create-comment.dto';
// import { User } from '../schema/user.schema';

// export class UpdateArticleDto {
//     @IsOptional()
//     @IsString()
//     readonly title: string;

//     @IsOptional()
//     @IsString()
//     readonly content: string;

//     @IsOptional()
//     @IsString()
//     readonly image: string;

//     @IsOptional()
//     @IsString()
//     readonly author: string;

//     @IsOptional()
//     @IsArray()
//     readonly comments: CreateCommentDto[]

//     @IsEmpty({ message: 'You cannot pass user id' })
//     readonly user: User;
// }
