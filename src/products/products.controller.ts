import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request, Response } from 'express';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async getProducts(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.productsService.getAll();
      res.render('product-list', {
        user: req.body.logged_in_user,
        productlist: JSON.parse(JSON.stringify(result.data)),
      });
    } catch (error) {
      res.render('product-list', {
        user: req.body.logged_in_user,
        productlist: [],
      });
    }
  }

  @Get('add')
  async getAddProduct(@Req() req: Request, @Res() res: Response) {
    try {
      const categories = await this.categoriesService.getAll();
      res.render('add-product', {
        user: req.body.logged_in_user,
        product: {},
        categories: JSON.parse(JSON.stringify(categories.data)),
      });
    } catch (error) {
      const result = await this.productsService.getAll();
      res.render('product-list', {
        user: req.body.logged_in_user,
        productlist: JSON.parse(JSON.stringify(result.data)),
      });
    }
  }

  @Post()
  async addProduct(@Req() req: Request, @Res() res: Response) {
    try {
      req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
      const product = await this.productsService.createProduct(req.body);
      if (!product.status) {
        const categories = await this.categoriesService.getAll();
        res.render('add-product', {
          user: req.body.logged_in_user,
          error: product.message,
          product: JSON.parse(JSON.stringify(product.data)),
          categories: JSON.parse(JSON.stringify(categories.data)),
        });
      } else {
        res.redirect('/products');
      }
    } catch (error) {
      res.redirect('/products');
    }
  }

  @Get(':product_id')
  async getEditProduct(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.params.product_id) {
        const product = await this.productsService.getProductById(
          req.params.product_id,
        );
        if (product.status) {
          const categories = await this.categoriesService.getAll();
          res.render('edit-product', {
            user: req.body.logged_in_user,
            product: product.data,
            categories: JSON.parse(JSON.stringify(categories.data)),
          });
        } else {
          res.redirect('/products');
        }
      } else {
        res.redirect('/products');
      }
    } catch (error) {
      res.redirect('/products');
    }
  }

  @Post(':product_id')
  async editProduct(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.params.product_id) {
        req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
        await this.productsService.updateProduct(
          req.params.product_id,
          req.body,
        );
        res.redirect('/products');
      } else {
        res.redirect('/products');
      }
    } catch (error) {
      res.redirect('/products');
    }
  }

  @Get('delete/:product_id')
  async deleteProduct(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.params.product_id) {
        await this.productsService.deleteProduct(req.params.product_id);
      }
      res.redirect('/products');
    } catch (error) {
      res.redirect('/products');
    }
  }
}
