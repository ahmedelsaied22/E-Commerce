import { Injectable } from '@nestjs/common';
import { Order } from '../models/order.model';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderRepo extends DBRepo<Order> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }
}
