import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    DatabaseModule,
    DashboardModule,
    EmailModule,
    MailerModule.forRoot({
      transport: {
        host: new ConfigService().get('EMAIL_SERVICE'),
        port: Number(new ConfigService().get('EMAIL_PORT')),
        secure: false,
        auth: {
          user: new ConfigService().get('EMAIL_USER'),
          pass: new ConfigService().get('EMAIL_PASSWORD'),
        },
      },
    }),
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
