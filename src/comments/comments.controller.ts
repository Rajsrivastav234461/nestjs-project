

// comments controlller PAGINATION

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
   
} from '@nestjs/common';
 import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'This is a sample comment.' },
        postId: { type: 'number', example: 1 },
      },
    },
  })
  
  @ApiResponse({ status: 201, description: 'Comment posted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.id;
    try {
      await this.commentsService.create(createCommentDto, userId);
      return { message: 'Comment posted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

   @Get()
   @ApiOperation({ summary: 'Get all comments' }) // Describes the endpoint's functionality
   @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all comments.',
   })
   async findAll(){
     return await this.commentsService.findAllComment()
   }

 
  @Get('post/:postId')
  
  @ApiOperation({ summary: 'Get all comments for a post with pagination' })
  @ApiParam({ name: 'postId', type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'List of comments with pagination' })
  @ApiResponse({ status: 404, description: 'No comments found for this post' })
  async findAllByPost(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Request() req
  ) {
    const userId = req.user.id;
    try {
      const result = await this.commentsService.findAllByPost(
        Number(postId),
        userId,
        Number(page),
        Number(limit)
      );
      if (!result.data.length) {
        throw new HttpException('No comments found for this post', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID (accessible by creator or post owner)' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'You are not authorized to delete this comment' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    try {
      return await this.commentsService.remove(Number(id), userId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.FORBIDDEN);
    }
  }
}
