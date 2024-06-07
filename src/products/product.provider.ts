import { Product } from '../products/entities/product.entity';

export const productProviders = [
  {
    provide: 'PRODUCTS_REPOSITORY',
    useValue: Product,
  },
];