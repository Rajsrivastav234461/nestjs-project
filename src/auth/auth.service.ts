import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt.strategy';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(body: { username: string; password: string }) {
    const user = await this.usersService.findOne(body.username); // Ensure `findOne` fetches user by username

    if (!user) {
      throw new NotFoundException('User does not exist. Please sign up first.');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password.');
    }
        
    const payload: JwtPayload = { username: user.username, sub: user.id };//i defined particular userId for it
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
