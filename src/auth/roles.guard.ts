// src/auth/roles.guard.ts

 import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';   

@Injectable()   
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  
  // The Reflector is used to retrieve metadata (like roles)  
  constructor(private reflector: Reflector) {
    super();  // Calling the constructor of JwtAuthGuard, which is responsible for validating the JWT token.
  }

  // This method determines if the current user has the required roles to access the route.
  canActivate(context: ExecutionContext): boolean {
    // Get the 'roles' metadata from the route handler using Reflector. This metadata is set by the Roles decorator.
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // If no roles are required for the route (i.e., no role-based access control), the request is allowed to proceed.
    if (!requiredRoles) {
      return true;
    }

    // Retrieve the user object from the request.   
    const user = context.switchToHttp().getRequest().user;
    
    console.log(user);   

    // Check if the user has any of the required roles. if yes grant access, otherwise deny access.
    return requiredRoles.some(role => role === user.role);
  }
}
