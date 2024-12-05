import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
   async create(createUserDto: CreateUserDto) {
    // Check if the email or username already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(createUserDto.password, 10);

    // Create the new user
   let user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: passwordHash,
        role: createUserDto.role || 'USER',
      },
    });

    //signed up user can directly access to the route of post
    // let payload = {
    //   username:user.username, sub:user.id
    // }

    // let token = jwt.sign(payload,'secretKey',{expiresIn:'1d'})

    return {status:200, message: "Signup successful" }; // Return success message
  }

  //can get the all user's detail
  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
