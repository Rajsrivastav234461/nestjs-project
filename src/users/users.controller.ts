import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
 
@Controller('users')
@ApiTags('Signup Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
   @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'xyz' },
        email: { type: 'string', example: 'xyz@example.com' },
        password: { type: 'string', example: 'pass123' },
        role: { type: 'string', example: 'USER' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
   findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':username') 
  findById(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }
}

