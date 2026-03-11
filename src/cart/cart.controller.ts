/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Types } from 'mongoose';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @UseGuards(AuthGuard)
  async addToCart(
    @Req() req: AuthReq,
    @Body()
    productData: {
      product: Types.ObjectId;
      quantity: number;
    },
  ) {
    const userId = req.user._id;
    return {
      data: await this.cartService.addToCart({ userId, productData }),
    };
  }
}
