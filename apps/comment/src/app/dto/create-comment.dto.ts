import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "@article-workspace/data";


export class CreateCommentDto {
    @IsOptional()
    readonly id: string; 
  
    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User; 
  
    @IsNotEmpty()
    @IsString()
    readonly content: string;
  
    @IsOptional()
    readonly createdAt: Date;
  }