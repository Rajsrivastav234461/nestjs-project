

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

//static module
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//modules
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';

//event
import { EventEmitterModule } from '@nestjs/event-emitter';
//middleware
import { LoggerMiddleware } from './middleware/logger.middleware';


@Module({
  imports: [
    EventEmitterModule.forRoot(),
  
    PostsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
    NotificationsModule, // Add NotificationsModule
    PrismaModule,  

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from uploads folder
      serveRoot: '/uploads', // Route prefix
    }),
  ],
  
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply LoggerMiddleware globally
  }
}