import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const user = await jwt.verify(
      request.cookies.token,
      this.configService.get('SECRET'),
    );
    if (user.is_admin == true) {
      return true;
    } else {
      return false;
    }
  }
}
