import { BOOLEAN, DATE, INTEGER, STRING } from 'sequelize';
import { Table, Column, Model, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({ modelName: 'categories', timestamps: false })
export class Category extends Model {
  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  category_id: number;

  @Column({ type: STRING, allowNull: false })
  name: string;

  @Column({ type: STRING, allowNull: true })
  description: string;

  @Column({ type: BOOLEAN, defaultValue: 1 })
  is_active: boolean;

  @Column({ type: BOOLEAN, defaultValue: 0 })
  is_deleted: boolean;

  @Column({ type: DATE })
  created_at: Date;

  @Column({ type: DATE })
  updated_at: Date;
  
  @BeforeCreate
  static BeforeCreate(category: Category) {
    category.created_at = new Date();
  }

  @BeforeUpdate
  static BeforeUpdate(category: Category) {
    category.updated_at = new Date();
  }

}