import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { categoryProviders } from './category.provider';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CategoriesController],
  providers: [CategoriesService,
    ...categoryProviders
  ],
  exports:[CategoriesService]
})
// export class CategoriesModule {}
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(CategoriesController);
  }
}
