// import {
//   IsArray,
//     IsEmpty,
//     IsNotEmpty,
//     IsOptional,
//     IsString,
//   } from 'class-validator';
// import { CreateCommentDto } from './create-comment.dto';
// import { User } from '../schema/user.schema';

// export class CreateArticleDto {
//     @IsNotEmpty()
//     @IsString()
//     readonly title: string;

//     @IsNotEmpty()
//     @IsString()
//     readonly content: string;

//     @IsString()
//     readonly image: string;

//     @IsString()
//     readonly author: string;
    
//     @IsOptional()
//     @IsArray()
//     readonly comments: CreateCommentDto[]

//     @IsEmpty({ message: 'You cannot pass user id' })
//     readonly user: User
// }
