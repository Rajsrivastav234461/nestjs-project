// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'srivastavnitesh513@gmail.com',
      pass: 'wuppdimkhcvyaefv'

    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"NestJS App" <srivastavnitesh513@gmail.com>',
        to,
        subject,
        text,
      });
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}


