import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './user.provider';
import { EmailModule } from 'src/email/email.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EmailModule, AuthModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, 
    ...usersProviders
  ],
  exports:[UsersService]
})
// export class UsersModule {}
export class UsersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController);
  }
}