import { Inject, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORIES_REPOSITORY')
    private categoryRepository: typeof Category,
  ) {}

  async getAll() {
    try {
      const categories = await this.categoryRepository.findAll({
        where: { is_deleted: 0 },
      });
      return {
        status: true,
        data: categories,
        message: 'Fetched all users successfully!',
      };
    } catch (error) {
      return { status: false, data: [], message: error.message, error };
    }
  }

  async getCategoryByName(name) {
    try {
      const data = await this.categoryRepository.findOne({
        where: {
          name: name,
          is_deleted: 0,
        },
      });
      if (data) {
        return { status: true, data: data, message: 'User found!' };
      } else {
        return { status: false, data: {}, message: 'User not found!' };
      }
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async createCategory(categoryData) {
    try {
      const category = await this.getCategoryByName(categoryData.name);
      if (category.status) {
        return {
          status: false,
          data: category,
          message: 'Category with the same name already exists!',
        };
      }
      const data = await this.categoryRepository.create(categoryData);

      return {
        status: true,
        data: data,
        message: 'Category created successfully!',
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async updateCategory(category_id, data) {
    try {
      const category = await this.getCategoryByName(data.name);
      if (
        category.status &&
        JSON.parse(JSON.stringify(category)).data.category_id != category_id
      ) {
        return {
          status: false,
          data: category,
          message: 'Category with the same name already exists!',
        };
      }
      await this.categoryRepository.update(data, {
        where: {
          category_id: category_id,
        },
        individualHooks: true,
      });
      return {
        status: true,
        message: 'Category updated successfully!',
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async getCategoryById(category_id) {
    try {
      const category = await this.categoryRepository.findByPk(category_id);
      return {
        status: true,
        data: category,
        message: 'Fetched all categories successfully!',
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async deleteCategory(category_id) {
    try {
      const category = await this.categoryRepository.update(
        {
          is_deleted: 1,
        },
        {
          where: {
            category_id: category_id,
          },
        },
      );
      return {
        status: true,
        data: category,
        message: 'Deleted category successfully!',
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }
}
