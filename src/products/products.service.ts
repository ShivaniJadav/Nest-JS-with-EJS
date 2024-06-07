import { Inject, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
    constructor(
        @Inject('PRODUCTS_REPOSITORY')
        private productRepository: typeof Product,

        // @Inject('CATEGORIES_REPOSITORY')
        // private categoryRepository: typeof Category,
      ) {}

      async getProductByName(name) {
        try {
          const data = await  this.productRepository.findOne({
            where: {
              name: name,
              is_deleted: 0,
            },
          });
          if (data) {
            return { status: true, data: data, message: "User found!" };
          } else {
            return { status: false, data: {}, message: "User not found!" };
          }
        } catch (error) {
          return { status: false, data: error, message: error.message };
        }
      };

      async createProduct(productData) {
        try {
            const product = await this.getProductByName(productData.name);
          if (product.status) {
            return {
              status: false,
              data: product,
              message: "Product with the same name already exists!",
            };
          }
          const data = await this.productRepository.create(productData);
      
          return {
            status: true,
            data: data,
            message: "Product created successfully!",
          };
        } catch (error) {
          return { status: false, data: error, message: error.message };
        }
      };
      
      async updateProduct(product_id, data)  {
        try {
            const product = await this.getProductByName(data.name);
          if (
            product.status &&
            JSON.parse(JSON.stringify(product)).data.product_id != product_id
          ) {
            return {
              status: false,
              data: product,
              message: "Product with the same name already exists!",
            };
          }
          await  this.productRepository.update(data, {
            where: {
              product_id: product_id,
            },
            individualHooks: true,
          });
          return {
            status: true,
            message: "Product updated successfully!",
          };
        } catch (error) {
          return { status: false, data: error, message: error.message };
        }
      };
      
      async getAll()  {
        try {
            const products = await this.productRepository.findAll({
            where: { is_deleted: 0 },
            include: {
              model: Category,
              where: { is_deleted: 0 },
            },
          });
          return {
            status: true,
            data: products,
            message: "Fetched all products successfully!",
          };
        } catch (error) {
          return { status: false, data: [], message: error.message, error };
        }
      };
      
      async getProductById(product_id)  {
        try {
            const product = await this.productRepository.findByPk(product_id);
          return {
            status: true,
            data: product,
            message: "Fetched all categories successfully!",
          };
        } catch (error) {
          return { status: false, data: error, message: error.message };
        }
      };
      
      async deleteProduct(product_id)  {
        try {
            const product = await this.productRepository.update(
            { is_deleted: 1, },
            {
              where: { product_id: product_id },
            }
          );
          return {
            status: true,
            data: product,
            message: "Deleted product successfully!",
          };
        } catch (error) {
          return { status: false, data: error, message: error.message };
        }
      };
}
