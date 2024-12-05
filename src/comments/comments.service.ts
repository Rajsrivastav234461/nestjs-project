 
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
 
import { CommentCreatedEvent } from './events/comment-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new comment and emit an event
   */
  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId } = createCommentDto;
    
    // Check if the post with the given postId exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
         
    // If the post does not exist, throw a NotFoundException
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Create the comment in the database
    const comment = await this.prisma.comment.create({
      data: { content, userId, postId },
    });
        
    // Emit the 'comment.created' event with the new comment details
    const event = new CommentCreatedEvent(comment.id, userId, content, postId);
    this.eventEmitter.emit('comment.created', event);

    return comment;
  } 
     
  async findAllComment(){
   return this.prisma.comment.findMany({
      // where:{

      // },
      select:{
        id:true,
        content:true,
        postId:true,
       }
    })
  }
  

  /*                                                                 
   * Retrieve all comments for a specific post with pagination
   */
  async findAllByPost(postId: number, userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Fetch comments and total count using a transaction
     // The function uses Prisma's $transaction to run two queries in a single database transaction:

    const [comments, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: {
          postId,
          OR: [{ userId }, { post: { userId } }], //filters by the userId or the user who created the post.
        },
        select: {
          id: true,
          content: true,
          postId: true,
          user: { select: { id: true, username: true } },
          post: { select: { userId: true, user: { select: { id: true, username: true } } } },
        },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({
        where: {
          postId,
          OR: [{ userId }, { post: { userId } }],
        },
      }),
    ]);

    const data = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      user: comment.post.user,
    }));

    return { data, total, page, limit };
  }

  /**
   * Delete a comment with authorization check
   */
  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { post: true },//include post content as well
    });

    // Ensure the comment exists
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Ensure the user has permission to delete the comment
    if (comment.userId !== userId && comment.post.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    // Delete the comment and log the action
    await this.prisma.comment.delete({ where: { id } });
    console.log(`Comment ${id} deleted by user ${userId}`);

    return { message: 'Comment deleted successfully' };
  }
}
