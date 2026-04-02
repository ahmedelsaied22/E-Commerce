import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Coupon } from 'src/db/models/coupon.model';
import { CouponRepo } from 'src/db/repo/coupon.repo';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponRepo) {}

  async addCoupon(couponData: Partial<Coupon>) {
    const coupon = await this.couponRepo.findOne({
      filter: {
        code: couponData.code,
      },
    });
    if (coupon) {
      throw new BadRequestException('coupon already exist');
    }
    const newCoupon = await this.couponRepo.create({
      data: {
        code: couponData.code,
        discount: couponData.discount,
        expiredAt: new Date(Date.now() + 24 * 60 * 1000 * 60),
        totalUses: couponData.totalUses,
        maxCount: couponData.maxCount,
      },
    });
    console.log(newCoupon);
    return {
      data: newCoupon,
    };
  }

  async updateCoupon({
    maxCount,
    couponId,
  }: {
    maxCount: number;
    couponId: Types.ObjectId;
  }) {
    const couponExist = await this.couponRepo.findById({
      id: couponId,
    });
    if (!couponExist) {
      throw new NotFoundException('coupon not found');
    }
    couponExist.maxCount = maxCount || couponExist.maxCount;
    await couponExist.save();
    return {
      msg: 'coupon updated successfully',
      data: {},
    };
  }

  async deleteCoupon(coupon: string) {
    const isCouponExist = await this.couponRepo.findOne({
      filter: {
        code: coupon,
      },
    });
    if (!isCouponExist) {
      throw new NotFoundException('coupon not found');
    }
    await this.couponRepo.deleteOne({
      filter: {
        code: coupon,
      },
    });
    return {
      data: {},
    };
  }
}

// insure form the role before adding or deleting coupon and fix all the project roles
