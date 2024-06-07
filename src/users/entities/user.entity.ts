import { BOOLEAN, DATE, INTEGER, STRING } from 'sequelize';
import { Table, Column, Model, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import * as bcrypt from "bcrypt";

@Table({ modelName: 'users', timestamps: false })
export class User extends Model {
  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  user_id: number;

  @Column({ type: STRING, allowNull: false })
  first_name: string;

  @Column({ type: STRING, allowNull: false })
  last_name: string;

  @Column({ type: STRING, allowNull: false })
  email: string;

  @Column({ type: STRING, allowNull: false })
  password: string;

  @Column({ type: STRING, allowNull: false })
  mobile_no: string;

  @Column({ type: STRING })
  photo: string;

  @Column({ type: STRING })
  password_otp: string;

  @Column({ type: STRING })
  mobile_otp: string;

  @Column({ type: BOOLEAN, defaultValue: 0 })
  is_verified: boolean;

  @Column({ type: BOOLEAN, defaultValue: 0 })
  is_admin: boolean;

  @Column({ type: BOOLEAN, defaultValue: 1 })
  is_active: boolean;

  @Column({ type: DATE })
  last_password_otp_at: Date;

  @Column({ type: DATE })
  last_email_otp_at: Date;

  @Column({ type: DATE })
  created_at: Date;

  @Column({ type: DATE })
  updated_at: Date;
  
  @BeforeCreate
  static BeforeCreate(user: User) {
    user.created_at = new Date();
    user.password = bcrypt.hashSync(user.password, 10)
  }

  @BeforeUpdate
  static BeforeUpdate(user: User) {
    user.updated_at = new Date();
    if(user.password) {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }

}