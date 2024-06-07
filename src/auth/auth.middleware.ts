import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService
  ){}

  async use(req: Request, res: Response, next: () => void) {
    try {
            if(typeof req.cookies?.token == "undefined") {
                res.redirect('/login');
            } else if (req.cookies.token != "") {
                const result = await jwt.verify(req.cookies.token, this.configService.get('SECRET'))
                res.cookie('user', result, { 
                    maxAge: 3600 * 1000 // 1 hour
                });
                req.body['logged_in_user'] = result;
                next();
            } else {
                res.render('login', {error: "Session Expired! Please Log In again!"});
            }
        } catch (error) {
            res.render('login', {error: error.message});
        }
  }
}
