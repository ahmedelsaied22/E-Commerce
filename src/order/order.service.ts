/* eslint-disable prefer-const */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaymentMethodEnum } from 'src/db/models/order.model';
import { Product } from 'src/db/models/product.model';
import { CartRepo } from 'src/db/repo/cart.repo';
import { OrderRepo } from 'src/db/repo/order.repo';
import { ProductRepo } from 'src/db/repo/product.repo';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async createOrder({
    userId,
    discount,
    instructions,
    address,
    phone,
    paymentMethod,
  }: {
    userId: Types.ObjectId;
    discount: number;
    instructions: string[];
    address: string;
    phone: string;
    paymentMethod: PaymentMethodEnum;
  }) {
    console.log({
      userId,
      discount,
      instructions,
      address,
      phone,
      paymentMethod,
    });
    const cart = await this.cartRepo.findOne({
      filter: {
        userId,
      },
      options: {
        populate: [
          {
            path: 'items.product',
          },
        ],
      },
    });
    if (!cart || !cart.items || cart.items?.length == 0) {
      throw new BadRequestException('cart is empty');
    }
    let subTotal = cart.items.reduce<number>((totalPrice, item) => {
      if (!item.product) {
        throw new BadRequestException('product not found');
      }
      const product: Product = item.product as unknown as Product;
      return (totalPrice + Number(product.salePrice)) * item.quantity;
    }, 0);
    let total = subTotal - (discount == 0 ? 0 : discount / 100) * subTotal;
    for (const item of cart.items) {
      await this.productRepo.updateOne({
        filter: {
          _id: item.product,
        },
        update: {
          $inc: {
            stock: -item.quantity,
          },
        },
      });
      const order = await this.orderRepo.create({
        data: {
          userId,
          phone,
          address,
          discount,
          instructions,
          items: cart.items,
          paymentMethod,
          total,
        },
      });
      cart.items = [];
      await cart.save();
      return {
        data: order,
      };
    }
  }
}
