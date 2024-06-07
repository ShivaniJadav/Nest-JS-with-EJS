import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { productProviders } from './product.provider';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { CategoriesModule } from 'src/categories/categories.module';
// import { categoryProviders } from 'src/categories/category.provider';


@Module({
  imports: [ConfigModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, 
    ...productProviders,
    // ...categoryProviders
  ],
})
// export class ProductsModule {}
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProductsController);
  }
}
