import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { Category } from '../models/category.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryRepo extends DBRepo<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }
}
