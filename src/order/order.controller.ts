/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { CouponRepo } from 'src/db/repo/coupon.repo';
import { Order } from 'src/db/models/order.model';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly couponRepo: CouponRepo,
  ) {}

  @Post('create-order')
  @UseGuards(AuthGuard)
  async createOrder(@Req() req: AuthReq, @Body() body) {
    const code = body.coupon;
    let discount = 0;
    if (code) {
      const coupon = await this.couponRepo.findOne({
        filter: {
          code,
        },
      });
      if (!coupon) {
        throw new NotFoundException('in-valid coupon');
      }
      if (
        !coupon.expiredAt ||
        !coupon.totalUses ||
        new Date(Date.now()) > coupon?.expiredAt ||
        coupon.maxCount == coupon.totalUses
      ) {
        throw new BadRequestException('coupon expired');
      }
      discount = coupon?.discount || 0;
      coupon.totalUses += 1;
      await coupon.save();
    }

    const data = {
      userId: req.user._id,
      discount,
      instructions: body.instructions,
      address: body.address,
      phone: body.phone,
      paymentMethod: body.paymentMethod,
    };
    console.log(data);
    return {
      data: this.orderService.createOrder(data),
    };
  }
}
