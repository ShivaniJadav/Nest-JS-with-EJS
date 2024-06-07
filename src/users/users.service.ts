import { Inject, Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { generate } from 'otp-generator';
// import * as core from "../../core/core.js";
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {

  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    private readonly emailService: EmailService
  ) {}

  async getUserByEmail(email: string) {
    try {
      const data = await this.usersRepository.findOne({
        where: {
          email: email,
          is_active: true
        },
      });
      if (data) {
        return { status: true, data: data, message: "User found!" };
      } else {
        return { status: false, data: {}, message: "Email address doesn't exist!" };
      }
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  };

  async createUser(userData) {
    try {
      const user = await this.getUserByEmail(userData.email);
      if (user.status) {
        return { status: false, data: user, message: "Email already exists!" };
      }
      const data = await this.usersRepository.create(userData);
  
      // const otp = generate(6, {
      //   upperCaseAlphabets: false,
      //   specialChars: false,
      //   digits: true,
      //   lowerCaseAlphabets: false,
      // });
  
      // await this.usersRepository.update({ email_otp: otp, last_email_otp_at: new Date() }, {
      //   where: { user_id: data.user_id }
      // })
  
      // await this.emailService.sendMail({
      //   email: userData.email,
      //   subject: `New Registration - Confirm your email`,
      //   text: ``,
      //   html: `<!DOCTYPE html>
      //     <html lang="en">
      //     <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>Proxe-E Email Verification</title>
      //       <style>
      //         /* Add your custom styles here */
      //         body {
      //           font-family: Arial, sans-serif;
      //           background-color: #f4f4f4;
      //           margin: 0;
      //           padding: 0;
      //         }
      //         .container {
      //           max-width: 600px;
      //           margin: 20px auto;
      //           padding: 20px;
      //           background-color: #fff;
      //           border-radius: 8px;
      //           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      //         }
      //         .logo {
      //           text-align: center;
      //           margin-bottom: 20px;
      //         }
      //         .content {
      //           text-align: left;
      //         }
      //         .button {
      //           display: inline-block;
      //           padding: 10px 20px !important;
      //           margin-top: 20px !important;
      //           background-color: rgb(253, 51, 126);
      //           color: #000000;
      //           text-decoration: none;
      //           border-radius: 5px;
      //         }
      //       </style>
      //     </head>
      //     <body>
      //       <div class="container">
      //         <div class="logo" style="text-align:center;">
      //           <h2>Verify Your Email</h2>
      //         </div>
      //         <div class="content">
      //           <div>Dear ${userData.first_name.replace(
      //             userData.first_name.slice(0, 1),
      //             userData.first_name.slice(0, 1).toLocaleUpperCase()
      //           )},</div><br>
      //           <div>Thank you for registering with ReWard.</div><br>
      //           <div>To verify your email address, please use the following One-Time Password (OTP):</div><br>
      //           <div style="font-size: large; font-weight: 800;">${otp}</div><br>
      //           <div>This OTP is valid for the next 5 minutes. For your security, please do not share this code with anyone.<br>
      //           If you did not request this verification, please ignore this email or contact our support team immediately.</div><br>
      //           <div>If you have any questions or need assistance, please feel free to reach out to our support team at <a href='mailto:support@prox-e.io'>reward@yopmail.com</a></div><br>
      //           <div>Best Regards,<br>The ReWard Team</div>
      //         </div>
      //       </div>
      //     </body>
      //     </html>`,
      // });
  
      return {
        status: true,
        data: data,
        message: "User registered successfully!",
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async getUserCount() {
    try {
      const count = await this.usersRepository.count({
        where: {
          is_admin: false,
          is_active: true
        },
      });
      return count;
    } catch (error) {
      return 0;
    }
  };

  async getAll(count = 0) {
    try {
      let users;
      if(count == 0) {
        users = await this.usersRepository.findAll({ where: { is_admin: 0 }, order: [['user_id', 'DESC']] });
      } else {
        users = await this.usersRepository.findAll({ where: { is_admin: 0 }, order: [['user_id', 'DESC']], limit: count });
      }
      return {
        status: true,
        data: users,
        message: "Fetched all users successfully!",
      };
    } catch (error) {
      return { status: false, data: [], message: error.message, error };
    }
  };

  async updatePassword(user_id, password) {
    try {
      const user = await this.usersRepository.update(
        {
          password: password,
        },
        {
          where: {
            user_id: user_id,
          },
          individualHooks: true,
        }
      );
      return {
        status: true,
        data: user,
        message: "Password changed successfully!",
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  async updateUser(user_id, data) {
    try {
      let user = await this.getUserByEmail(data.email);
      if (user.status && JSON.parse(JSON.stringify(user)).data.user_id != user_id) {
        return { status: false, data: user, message: "Email already exists!" };
      }
      await this.usersRepository.update(
        data,
        {
          where: {
            user_id: user_id,
          },
          individualHooks: true,
        }
      );
      user = await this.getUserById(user_id);
      return {
        status: true,
        data: JSON.parse(JSON.stringify(user.data)),
        message: "User updated successfully!",
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  };

  async getUserById(user_id){
    try {
      const user = await this.usersRepository.findByPk(user_id);
      return {
        status: true,
        data: user,
        message: "Fetched all users successfully!",
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  };

  async updatePasswordOTP(user_id, otp) {
    try {
      const user = await this.usersRepository.update(
        {
          password_otp:  otp,
          last_password_otp_at: new Date()
        },
        {
          where: {
            user_id: user_id,
          },
          individualHooks: true,
        }
      );
      return {
        status: true,
        data: user,
        message: "Password changed successfully!",
      };
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }
}
