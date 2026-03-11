import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from 'src/db/models/coupon.model';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create-coupon')
  async addCoupon(@Body() body: Partial<Coupon>) {
    const data = {
      code: body.code,
      discount: body.discount,
      totalUses: body.totalUses,
      maxCount: body.maxCount,
    };
    // console.log(data);
    return {
      data: await this.couponService.addCoupon(data),
    };
  }
}
