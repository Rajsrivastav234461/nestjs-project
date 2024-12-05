// src/auth/jwt.strategy.ts
//JwtStrategy validates JWT tokens and retrieves user data.

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  username: string;
  sub: number;
}

//validate JWT token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  //This contains the decoded data from the JWT, such as username and sub (the user ID).
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.username);
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user;
  }
}

