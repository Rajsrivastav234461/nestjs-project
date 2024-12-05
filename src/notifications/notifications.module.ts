// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailService } from 'src/mail/mail.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Add PrismaModule here

  providers: [NotificationsService,MailService],
})
export class NotificationsModule {}
