import { BadRequestException, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as jwt from "jsonwebtoken";
import { AuthService } from 'src/auth/auth.service';
import { AdminGuard } from 'src/auth/admin.guard';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AdminGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.usersService.getAll();
      return res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
    } catch (error) {
      return res.render('user-list', { user: req.body.logged_in_user, userlist: [] });
    }
  }
  
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      return res.render('profile', { user: req.body.logged_in_user });
    } catch (error) {
      return res.redirect('/dashboard');
    }
  }
  
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: {files: 1},
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
          const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const originalName = file.originalname;
          const newFileName = `${uniquePrefix}-${originalName}`;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image')) {
          return cb(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        cb(null, true);
      },
    })
  )
  @Post('profile')
  async Profile(@Req() req: Request, @Res() res: Response, @UploadedFile() file: any) {
    try {
      if(file?.filename) {
        req.body['photo'] = file?.filename;
      }
      const result = await this.usersService.updateUser(req.body.user_id, req.body);
      if(!result.status) {
        return res.render('/profile', { error: result.message });
      } else {
        const token = await jwt.sign({...JSON.parse(JSON.stringify(result.data)), timestamp: Date.now()}, process.env.SECRET);
        res.cookie('token', token, { 
            maxAge: 3600 * 1000 // 1 hour
          });
        return res.redirect('/dashboard');
      }
    } catch (error) {
      const result = await this.usersService.getAll();
      res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
    }
  }

  @Get('change-password')
  async getChangePassword(@Req() req: Request, @Res() res: Response) {
    try {
      return res.render('change-password', { user: req.body.logged_in_user });
    } catch (error) {
      return res.redirect('/dashboard');
    }
  }
  
  @Post('change-password')
  async changePassword(@Req() req: Request, @Res() res: Response) {
    try {
      const isMatched = await this.authService.MatchPassword(req.body.oldPassword, req.body?.logged_in_user?.password);
      if(isMatched) {
        await this.usersService.updatePassword(req.body?.logged_in_user?.user_id, req.body.password);
        return res.redirect('/dashboard')
      } else {
        return res.render('change-password', { oldpass: req.body.oldPassword, newpass: req.body.password, confirmpass: req.body.confirmPassword, oldPasswordServerError: 'Old password is incorrect!', user: req.body.logged_in_user });
      }
    } catch (error) {
      return res.redirect('change-password');
    }
  }

  @Get(':user_id')
  async getUser(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.params.user_id) {
        return res.redirect('/users');
      }
      const user = await this.usersService.getUserById(req.params.user_id)  
      if(user && user.status){
        res.render('edit-user', { user: req.body.logged_in_user, edituser: JSON.parse(JSON.stringify(user.data)) });
      } else {
        return res.redirect('/users');
      }
    } catch (error) {
      return res.redirect('/users');
    }
  }

  @UseInterceptors(
    FileInterceptor('photo', {
      limits: {files: 1},
      // dest:'/public/images',
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
          const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const originalName = file.originalname;
          const newFileName = `${uniquePrefix}-${originalName}`;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image')) {
          return cb(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        cb(null, true);
      },
    })
  )
  @Post(':user_id')
  async EditUser(@Req() req: Request, @Res() res: Response, @UploadedFile() file: any) {
    try {
      if(file?.filename) {
        req.body['photo'] = file?.filename;
      }
      req.body['is_verified'] = req.body?.is_verified == 'on' ? true : false;
      await this.usersService.updateUser(req.params.user_id, req.body);
      // window.location.href = '/';
      // res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(users.data)), error: result.status ? (users.status ? '' : users.message) : result.message });
      res.redirect('/users');
    } catch (error) {
      const result = await this.usersService.getAll();
      res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
    }
  }

}
