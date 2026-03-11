import { BadRequestException, Injectable } from '@nestjs/common';
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
    // console.log(coupon);
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
}
