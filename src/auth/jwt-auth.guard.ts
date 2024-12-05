// src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';

// Import AuthGuard from @nestjs/passport to utilize Passport.js strategies
  // The 'jwt' strategy refers to the Passport.js JWT strategy, which handles JWT token validation.

import { AuthGuard } from '@nestjs/passport';
// The guard automatically validates incoming requests by checking for a valid JWT token.


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
