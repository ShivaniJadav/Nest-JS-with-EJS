import { Injectable } from '@nestjs/common';
// import { CreateEmailDto } from './dto/create-email.dto';
// import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(mailData) {
    try {
      const data = await this.mailerService.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: mailData.email,
        subject: mailData.subject,
        html: mailData.html
      });
      return { status: true, message: 'Email sent successfully.', data: data };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }
}
