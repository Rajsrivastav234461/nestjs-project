// src/auth/roles.decorator.ts

// Import the SetMetadata function from NestJS to create custom decorators
import { SetMetadata } from '@nestjs/common';

// Define a custom decorator named "Roles"
// This decorator will allow assigning specific roles to route handlers
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
