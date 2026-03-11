import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { Cart } from '../models/cart.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartRepo extends DBRepo<Cart> {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {
    super(cartModel);
  }
}
