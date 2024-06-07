import { BOOLEAN, DATE, INTEGER, STRING } from 'sequelize';
import { Table, Column, Model, BeforeCreate, BeforeUpdate, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from 'src/categories/entities/category.entity';

@Table({ modelName: 'products', timestamps: false })
export class Product extends Model {
  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  product_id: number;

  @Column({ type: STRING, allowNull: false })
  name: string;

  @Column({ type: STRING, allowNull: true })
  description: string;

  @ForeignKey(() => Category)
  @Column({ type: BOOLEAN, allowNull: false })
  category_id: number;

  @Column({ type: BOOLEAN, defaultValue: 1 })
  is_active: boolean;

  @Column({ type: BOOLEAN, defaultValue: 0 })
  is_deleted: boolean;

  @Column({ type: DATE })
  created_at: Date;

  @Column({ type: DATE })
  updated_at: Date;
  
  @BeforeCreate
  static BeforeCreate(product: Product) {
    product.created_at = new Date();
  }

  @BeforeUpdate
  static BeforeUpdate(product: Product) {
    product.updated_at = new Date();
  }

  @BelongsTo(() => Category)
  category: Category;
}