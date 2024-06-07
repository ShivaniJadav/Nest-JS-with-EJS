import { BadRequestException, Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import * as jwt from "jsonwebtoken";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  @Get('signup')
  async getsignup(@Req() req: Request,  @Res() res: Response) {
    if(req.cookies?.token && req.cookies?.token != '') {
      res.redirect('/dashboard');
    } else {
      return res.render('signup');
    }
  }

  @Post('signup')
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
  async signup(@Req() req: Request,  @Res() res: Response, @UploadedFile() file: any) {
    try {
      req.body['photo'] = file?.filename || '';
      const result = await this.usersService.createUser(req.body);
      if(result.status) {
        res.redirect('login');
      } else {
        res.render('signup', { error: result.message, user: req.body });
      }
    } catch (error) {
      res.render('signup', { error: error.message });
    }
  }

  @Get(['login', ''])
  async getlogin(@Req() req: Request,  @Res() res: Response) {
    if(req.cookies?.token && req.cookies?.token != '') {
      res.redirect('/dashboard');
    } else {
      return res.render('login');
    }
  }

  @Post('login')
  async login(@Req() req: Request,  @Res() res: Response) {
    try {
      let user = await this.usersService.getUserByEmail(req.body.email);
      user = JSON.parse(JSON.stringify(user));
      if(user && user.data && user.data.password) {
        const isMatched = await this.authService.MatchPassword(req.body.password, user.data.password);
        if(isMatched) {
          const token = await jwt.sign({...user.data, timestamp: Date.now()}, this.configService.get('SECRET'));
          res.cookie('token', token, { 
            maxAge: 3600 * 1000 // 1 hour
          });
          if(user.data.is_admin) {
            // console.log('Admin Logged In');
            res.redirect('/dashboard');
          } else {
            res.render('login', { error: 'Please log into the Application!', email: req.body.email });
          }
        } else {
          res.render('login', { error: 'Incorrect Email or Password!', email: req.body.email });
        }
      } else {
        res.render('login', { error: 'Incorrect Email or Password!', email: req.body.email });
      }
    } catch (error) {
      res.render('login', { error: error.message, email: req.body.email });
    }
  }

  @Get('logout')
  async logout(@Req() req: Request,  @Res() res: Response) {
    try {
      res.clearCookie('token');
      res.redirect('login')
    } catch (error) {
      res.redirect('/dashboard')
    }
  }
 
  @Get('forgot-password')
  async getforgotpassword(@Req() req: Request,  @Res() res: Response) {
    try {
      return res.render("forgot-password");
    } catch (error) {
      res.redirect('/login')
    }
  }

  @Post('forgot-password')
  async forgotpassword(@Req() req: Request,  @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(req.body.email);
      if(!result.status) {
        res.render("forgot-password", {
          error: result.message,
          email: req.body.email,
        });  
      } else {
        res.cookie('reset_password_email', req.body.email, { 
          maxAge: 3600 * 1000 // 1 hour
        });
        res.redirect("/OTP-verification");
      }
    } catch (error) {
      res.render("forgot-password", {
        error: error.message,
        email: req.body.email,
      });
    }
  }

  @Get('OTP-verification')
  async getOTPverification(@Req() req: Request,  @Res() res: Response) {
    try {
      return res.render("OTP-verification");
    } catch (error) {
      res.redirect('/login')
    }
  }

  @Post('OTP-verification')
  async OTPverification(@Req() req: Request,  @Res() res: Response) {
    try {
      const email = req.cookies?.reset_password_email;
      if(email != '' || typeof email != "undefined") {
        const result = await this.authService.verifyOTP(email, req.body.otp);
        if(!result.status) {
          return res.render("OTP-verification", {
            error: result.message,
          });  
        } else {
          return res.redirect("/reset-password");
        }
      } else {
        return res.render("forgot-password", {
          error: 'Email is required.',
          email: req.body.email,
        });
      }
    } catch (error) {
      return res.render("forgot-password", {
        error: error.message,
        email: req.body.email,
      });
    }
  }

  @Get('resend-OTP')
  async getresendOTP(@Req() req: Request,  @Res() res: Response) {
    try {
      const email = req.cookies?.reset_password_email;
      req.body['email'] = email;
      this.forgotpassword(req, res);
    } catch (error) {
      res.render("forgot-password", {
        error: error.message,
        email: req.body.email,
      });
    }
  }

  @Get('reset-password')
  async getresetPassword(@Req() req: Request,  @Res() res: Response) {
    try {
      return res.render("reset-password");
    } catch (error) {
      res.redirect('/login')
    }
  }
  
  @Post('reset-password')
  async resetPassword(@Req() req: Request,  @Res() res: Response) {
    try {
      const email = req.cookies?.reset_password_email;
      if(email != '' || typeof email != "undefined") {
        const result = await this.authService.resetPassword(email, req.body.password);
        if(!result.status) {
          res.render("reset-password", {
            error: result.message,
          });  
        } else {
          res.cookie('reset_password_email', '', {
            maxAge: 0 
          });
          res.redirect('/login');
        }
      } else {
        res.render("forgot-password", {
          error: 'Email is required.',
          email: req.body.email,
        });
      }
    } catch (error) {
      res.render("reset-password", { error: error.message });
    }
  }

}
