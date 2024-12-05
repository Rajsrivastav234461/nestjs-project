

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
  
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService {
  
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        userId: createPostDto.userId, // User ID is now automatically passed
      },
    });
  }




  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate the file path and save the file
    const filePath = path.join(uploadsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }


  

  async findAll(userId: any) {
    return this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true, // Exclude 'password' here
          },
        },
        comments: true, // Include related comments
      },
      orderBy: {
        id: 'asc', // Order posts by ID in descending order
      },
    });
  }
  
     
  // async findOne(id: number, userId: number) {
  //   return this.prisma.post.findFirst({
  //     where: {
  //       id,
  //       userId,
  //     },
  //   });
  // }


  async findOne(id: number,userId:number) {
    return this.prisma.post.findUnique({
      where: { id},
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        comments: true,
      },
    });
  }

     
  // async update(id: number, userId: number, updatePostDto: CreatePostDto) {
  //   const existingPost = await this.findOne(id, userId);
  //   if (!existingPost) return null;
       
  //   return this.prisma.post.update({
  //      where: { id },
  //            data: updatePostDto,
  //   });
  // }
     

  async update(id: number, userId: number, updatePostDto: CreatePostDto) {
    const existingPost = await this.findOneByUser(id, userId);
    if (!existingPost) return null;

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }


//    async remove(id: number, userId: number) {
//     const existingPost = await this.findOne(id, userId);
//     if (!existingPost) return null;

//     return this.prisma.post.delete({
//       where: { id },
//     });
//   }
// }

  async remove(id: number, userId: number) {
    const existingPost = await this.findOneByUser(id, userId);
    if (!existingPost) return null;

    return this.prisma.post.delete({
      where: { id },
    });
  }

  private async findOneByUser(id: number, userId: number) {
    return this.prisma.post.findFirst({
      where: { id, userId },
    });
  }
}
