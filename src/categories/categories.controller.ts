import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Request, Response } from 'express';
import { AdminGuard } from 'src/auth/admin.guard';

@UseGuards(AdminGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.categoriesService.getAll();
      return res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
    } catch (error) {
      return res.render('category-list', { user: req.body.logged_in_user, categorylist: [] });
    }
  }

  @Get('add')
  async getAddCategory(@Req() req: Request, @Res() res: Response) {
    try {
      return res.render('add-category', { user: req.body.logged_in_user, category: {} });
    } catch (error) {
        return res.redirect('/categories')
      }
  }

  @Post()
  async addCategories(@Req() req: Request, @Res() res: Response) {
    try {
      req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
      const category = await this.categoriesService.createCategory(req.body);
      if(!category.status) {
        return res.render('add-category', { user: req.body.logged_in_user, error: category.message, category: JSON.parse(JSON.stringify(category.data)) });
      } else {
        return res.redirect('/categories');
      }
    } catch (error) {
        return res.redirect('/categories');
      }
  }

  @Get(':category_id')
  async getEditCategory(@Req() req: Request, @Res() res: Response) {
    try {
      if(req.params.category_id){
        const category = await this.categoriesService.getCategoryById(req.params.category_id)
        if(category.status) {
          return res.render('edit-category', { user: req.body.logged_in_user, category: category.data });
        } else {
          return res.redirect('/categories');
        }
      } else {
        return res.redirect('/categories');
      }
    } catch (error) {
        return res.redirect('/categories');
      }
  }

  @Post(':category_id')
  async editCategory(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.params.category_id) {
        req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
        await this.categoriesService.updateCategory(req.params.category_id, req.body);
        return res.redirect('/categories');
      } else {
        return res.redirect('/categories');
      }
    } catch (error) {
        return res.redirect('/categories');
      }
  }

  @Get('delete/:category_id')
  async deleteCategory(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.params.category_id) {
        await this.categoriesService.deleteCategory(req.params.category_id);
      }
      return res.redirect('/categories');
    } catch (error) {
      return res.redirect('/categories');
      }
  }

}
