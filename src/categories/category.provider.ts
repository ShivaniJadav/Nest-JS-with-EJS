import { Category } from './entities/category.entity';

export const categoryProviders = [
  {
    provide: 'CATEGORIES_REPOSITORY',
    useValue: Category,
  },
];