 

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  Request, 
  UseGuards, 
  HttpException, 
  HttpStatus,
  UseInterceptors,
  UploadedFile, 
   
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
 import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@ApiTags('Posts with permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  commentsService: any;
  constructor(private readonly postsService: PostsService) {}
     
  @Post()
  @Roles('USER') // Only Users can create posts
  @ApiOperation({ summary: 'Create a new post (User only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'My First Post' },
        content: { type: 'string', example: 'This is the content of the post.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Post successfully created' })
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.id; // Extract userId from the authenticated user
    return this.postsService.create({ ...createPostDto, userId });//spread syntax (...) copies the properties of createPostDto into the new object,
  }

  @Post('upload')
  @Roles('USER')
  @ApiOperation({ summary: 'Upload a file for a post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File upload failed' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const filePath = await this.postsService.saveFile(file);
      return { filePath, message: 'File uploaded successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get()
  @Roles('USER')
  @ApiOperation({ summary: 'Retrieve all posts (User only)' })
  @ApiResponse({ status: 200, description: 'List of posts retrieved successfully' })
  async findAll(@Request() req: any) {
    const userId = req.user.id; // Fetch posts for the logged-in user
    return this.postsService.findAll(userId);
  }
  

  // @Get(':id')
  // @Roles('USER')
  // @ApiOperation({ summary: 'Retrieve a post by ID (User only)' })
  // @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the post' })
  // @ApiResponse({ status: 200, description: 'Post details' })
  // @ApiResponse({ status: 403, description: 'Forbidden: Post does not belong to the user' })
  // @ApiResponse({ status: 404, description: 'Post not found' })
  // async findOne(@Param('id') id: string, @Request() req: any) {
  //   const userId = req.user.id;
  //   const post = await this.postsService.findOne(Number(id), userId);
  //   if (!post) {
  //     throw new HttpException('Post not found or unauthorized access', HttpStatus.FORBIDDEN);
  //   }
  //   return post;
  // }

  @Get(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Retrieve a post by ID (User only)' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the post' })
  @ApiResponse({ status: 200, description: 'Post details' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string,@Request() req: any) {
    const userId = req.user.id;
    const post = await this.postsService.findOne(Number(id),userId);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
  





  @Patch(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Update a post by ID (User only)' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the post to update' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Title' },
        content: { type: 'string', example: 'Updated content of the post.' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Post successfully updated' })
  async update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.id;
    const post = await this.postsService.update(Number(id), userId, updatePostDto);
    if (!post) {
      throw new HttpException('Post not found or unauthorized update', HttpStatus.FORBIDDEN);
    }
    return post;
  }

  @Delete(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Delete a post by ID (User only)' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the post to delete' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    const deleted = await this.postsService.remove(Number(id), userId);
    if (!deleted) {
      throw new HttpException('Post not found or unauthorized delete', HttpStatus.FORBIDDEN);
    }
    return { message: 'Post deleted successfully' };
  }
}


