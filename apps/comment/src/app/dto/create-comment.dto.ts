import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Article, User } from "@article-workspace/data";


export class CreateCommentDto {
    @IsOptional()
    readonly id: string; 
  
    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User; 

    @IsEmpty({ message: 'You cannot pass article id' })
    readonly article: Article; 
  
    @IsNotEmpty()
    @IsString()
    readonly content: string;
  
    @IsOptional()
    readonly createdAt: Date;
  }