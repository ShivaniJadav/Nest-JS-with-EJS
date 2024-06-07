import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
// import { AuthMiddleware } from './auth.middleware';
// import { usersProviders } from 'src/users/user.provider';

@Module({
  imports: [forwardRef(() => UsersModule), ConfigModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
