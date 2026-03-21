/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from 'src/db/models/coupon.model';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { RoleEnum } from 'src/db/models/user.model';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create-coupon')
  @UseGuards(AuthGuard)
  async addCoupon(@Req() req: AuthReq, @Body() body: Partial<Coupon>) {
    const user = req.user;
    if (user.role != RoleEnum.ADMIN) {
      throw new BadRequestException('you don`t have access to add new coupon');
    }
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

  @Delete('delete-coupon')
  @UseGuards(AuthGuard)
  async deleteCoupon(@Req() req: AuthReq, @Body() body) {
    const user = req.user;
    if (user.role != RoleEnum.ADMIN) {
      throw new BadRequestException('you don`t have access to delete coupon');
    }
    const coupon = body!.coupon as string;
    return await this.couponService.deleteCoupon(coupon);
  }
}
