import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string; // The content of the comment

  @IsInt()
  postId: number; // The ID of the post the comment is associated with
}
