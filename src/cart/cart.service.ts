/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from 'src/db/repo/cart.repo';
import { ProductRepo } from 'src/db/repo/product.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async addToCart({
    userId,
    productData,
  }: {
    userId: Types.ObjectId;
    productData: {
      product: Types.ObjectId;
      quantity: number;
    };
  }) {
    const { product, quantity } = productData;
    const isProductExist = await this.productRepo.findOne({
      filter: {
        _id: product as unknown as Types.ObjectId,
        stock: {
          $gte: quantity,
        },
      },
    });

    if (!isProductExist) {
      throw new NotFoundException(
        'this quantity unavailable from this product',
      );
    }

    let userCart = await this.cartRepo.findOne({
      filter: {
        userId,
      },
    });
    if (!userCart) {
      userCart = await this.cartRepo.create({
        data: {
          userId,
          items: [
            {
              product: product,
              quantity: quantity,
            },
          ],
        },
      });
      return {
        data: userCart,
      };
    } else {
      if (userCart.items == undefined) {
        userCart.items = [];
      }
      const productIndex = userCart.items.findIndex((item) => {
        return item.product.equals(product);
      }) as number;
      if (productIndex == -1) {
        userCart.items?.push({
          product: product,
          quantity: quantity,
        });
      } else {
        const foundItem = userCart.items![productIndex];
        let totalQuantity = quantity + foundItem.quantity;
        if (totalQuantity > (isProductExist.stock || 0)) {
          totalQuantity = isProductExist.stock || 0;
          await userCart.save();
          throw new NotFoundException(
            `only availabe stock is ${isProductExist.stock}`,
          );
        } else {
          foundItem.quantity = totalQuantity;
          await userCart.save();
        }
      }
    }
    return {
      data: userCart,
    };
  }
}
