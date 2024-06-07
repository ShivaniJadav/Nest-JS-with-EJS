import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
// import { EmailController } from './email.controller';
// import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
