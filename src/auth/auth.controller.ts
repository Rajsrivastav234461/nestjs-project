import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication And Authorization') // Grouping in Swagger
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'xyz_xyz' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJI...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid username or password' })
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body);
  }
}
