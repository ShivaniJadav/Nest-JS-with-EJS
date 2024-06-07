import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { UsersService } from 'src/users/users.service';
import { generate } from 'otp-generator';
import * as moment from 'moment';
// import * as core from "../../core/core.js";
import { EmailService } from 'src/email/email.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService
  ){}

  async MatchPassword(password:string, entered_password: string) {
    try {
      return await bcrypt.compare(
        password, entered_password,
      );
    } catch (error) {
      return false;
    }
  };

  async forgotPassword(email) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.status) {
        return { status: false, message: "Email is not registered.", data: {} };
      } else {
        const userdata = JSON.parse(JSON.stringify(user.data));
  
        const otp = generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
          digits: true,
          lowerCaseAlphabets: false,
        });
  
        await this.usersService.updatePasswordOTP(userdata.user_id, otp);
  
        await this.emailService.sendMail({
          email: userdata.email,
          subject: `Reset your password`,
          text: ``,
          html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset password</title>
              <style>
                /* Add your custom styles here */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .logo {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .content {
                  text-align: left;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px !important;
                  margin-top: 20px !important;
                  background-color: rgb(253, 51, 126);
                  color: #000000;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo" style="text-align:center;">
                  <h2>Reset your password</h2>
                </div>
                <div class="content">
                  <div>Dear ${userdata.first_name.replace(
                    userdata.first_name.slice(0, 1),
                    userdata.first_name.slice(0, 1).toLocaleUpperCase()
                  )},</div><br>
                  <div>To Reset your password, please use the following One-Time Password (OTP):</div><br>
                  <div style="font-size: large; font-weight: 800;">${otp}</div><br>
                  <div>This OTP is valid for the next 5 minutes. For your security, please do not share this code with anyone.<br>
                  If you did not request this verification, please ignore this email or contact our support team immediately.</div><br>
                  <div>If you have any questions or need assistance, please feel free to reach out to our support team at <a href='mailto:support@prox-e.io'>reward@yopmail.com</a></div><br>
                  <div>Best Regards,<br>The ReWard Team</div>
                </div>
              </div>
            </body>
            </html>`,
        });
        return {
          status: true,
          message: "OTP has been sent on this email",
          data: user,
        };
      }
    } catch (error) {
      return { status: false, message: error.message, data: {} };
    }
  };

  async verifyOTP(email, otp) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.status) {
        return { status: false, message: "Email is not registered.", data: {} };
      } else {
        const userData = JSON.parse(JSON.stringify(user.data));
  
        if (userData.password_otp === otp) {
          const OTPGenerationTime = moment(userData.last_password_otp_at);
          const cuurentTime = moment(new Date());
          // const duration = moment.duration(cuurentTime.diff(OTPGenerationTime));
          // const minutes = duration.minutes();
          const minutes = cuurentTime.diff(OTPGenerationTime, 'minutes');
          // const minutes = duration.minutes();
          if (minutes > 5) {
              return { status: false, message: "Your OTP is Expired. Please resend it.", data: {} };
          } else {
              return { status: true, message: "Your OTP is varified.", data: userData };
          }
        } else {
          return { status: false, message: "Your OTP is incorrect.", data: {} };
        }
      }
    } catch (error) {
      return { status: false, message: error.message, data: {} };
    }
  };

  async resetPassword(email, password) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user.status) {
        return { status: false, message: "Email is not registered.", data: {} };
      } else {
        const userData = JSON.parse(JSON.stringify(user.data));
        return await this.usersService.updatePassword(userData.user_id, password);
      }
    } catch (error) {
      return { status: false, message: error.message, data: {} };
    }
  };
}
