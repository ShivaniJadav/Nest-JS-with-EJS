import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
// import { Cat } from '../cats/cat.entity';

export const DatabaseService = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'nestjs-ejs',
      });
      sequelize.addModels([User, Category, Product]);
      await sequelize.sync({force: false});
      return sequelize;
    },
  },
];