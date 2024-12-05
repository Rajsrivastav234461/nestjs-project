// src/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()

    content: string;
     
    userId: number;  // This links the post to a user
  }
  