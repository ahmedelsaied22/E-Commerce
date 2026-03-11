import { Injectable } from '@nestjs/common';
import { Coupon } from '../models/coupon.model';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CouponRepo extends DBRepo<Coupon> {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {
    super(couponModel);
  }
}
