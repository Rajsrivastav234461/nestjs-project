// src/prisma/prisma.service.ts

// Import necessary modules
import { Injectable } from '@nestjs/common';  
import { PrismaClient } from '@prisma/client'; // Import the PrismaClient class, which provides access to the database

@Injectable()  
export class PrismaService extends PrismaClient { // Extends PrismaClient to add additional functionality specific to your application
   
  [x: string]: any; // This is a TypeScript index signature, allowing dynamic properties on the class
  
  constructor() {
    super(); // Calls the parent class constructor (PrismaClient) to initialize it
  }
}


