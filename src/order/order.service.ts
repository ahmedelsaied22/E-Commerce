/* eslint-disable prefer-const */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/db/models/order.model';
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
    coupon,
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
    coupon: Types.ObjectId;
    paymentMethod: PaymentMethodEnum;
  }) {
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

    const orderExist = await this.orderRepo.findOne({
      filter: {
        userId,
        orderStatus: OrderStatusEnum.PENDING,
      },
    });
    // console.log(orderExist);
    if (orderExist) throw new BadRequestException('you have a pending order');
    // else {
    //   await this.orderRepo.deleteOne({
    //     filter: {
    //       userId,
    //     },
    //   });
    // }

    const order = await this.orderRepo.create({
      data: {
        userId,
        cartId: cart._id,
        subTotal,
        phone,
        address,
        discount,
        instructions,
        items: cart.items,
        paymentMethod,
        total,
        coupon,
      },
    });
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
    }
    cart.items = [];
    await cart.save();
    return {
      data: order,
    };
  }

  async createCheckoutSession({
    userId,
    orderId,
  }: {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
  }) {
    const order = await this.orderRepo.findOne({
      filter: {
        _id: orderId,
        userId,
        status: OrderStatusEnum.PENDING,
        paymentMethod: PaymentMethodEnum.CARD,
      },
      options: {
        populate: [
          {
            path: 'userId',
          },
          {
            path: 'cartId',
          },
        ],
      },
    });
    if (!order) throw new BadRequestException('order not found');
  }
}
