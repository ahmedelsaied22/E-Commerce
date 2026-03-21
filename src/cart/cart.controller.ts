/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    return await this.cartService.addToCart({ userId, productData });
  }

  @Delete('delete-form-cart/:product')
  @UseGuards(AuthGuard)
  async deleteFromCart(
    @Req() req: AuthReq,
    @Param('product') product: Types.ObjectId,
  ) {
    const userId = req.user._id;
    // let quantity =  1;

    return await this.cartService.deleteFromCart({
      userId,
      product,
    });
  }
}
