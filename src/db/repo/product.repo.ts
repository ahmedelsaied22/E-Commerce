import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { Product } from '../models/product.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductRepo extends DBRepo<Product> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }
}
