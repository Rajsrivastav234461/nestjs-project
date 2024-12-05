
// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from '../comments/events/comment-created.event';
import { MailService } from '../mail/mail.service'; // Assuming you have a MailService for emails
import { PrismaService } from '../prisma/prisma.service'; // Assuming Prisma is used for DB access

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailService: MailService, // Service for sending emails
    private readonly prisma: PrismaService // Prisma service to access post and user data
  ) {}

  @OnEvent('comment.created')
  async handleCommentCreated(event: CommentCreatedEvent) {
    // Log the comment creation event
    console.log(`New comment created by user ${event.userId}: "${event.content}"`);

    // **Sending Email Notification**
    await this.sendEmailNotification(event);
  }

  /**
   * Send email notifications to the post author (post owner)
   */
  private async sendEmailNotification(event: CommentCreatedEvent) {
    // Retrieve the post owner's email from the database  
    const post = await this.prisma.post.findUnique({
      where: { id: event.postId }, // Get the post by its ID
      select: {
        user: {
          select: {
            email: true, // Fetch the email of the user who created the post
          },
        },
      },
    });

    // Check if the post exists and if the email is available
    if (!post || !post.user || !post.user.email) {
      console.log(`No email found for post owner of post ${event.postId}`);
      return;
    }    

    const recipientEmail = post.user.email;
    const subject = 'New Comment on Your Post';
    const message = `Hello, your post has a new comment: "${event.content}"`;

    // Send the email notification to the post owner
    await this.mailService.sendEmail(recipientEmail, subject, message);
    console.log(`Email sent to ${recipientEmail}`);
  }
} 


 
 