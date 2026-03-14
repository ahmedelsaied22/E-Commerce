/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  // BadRequestException,
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

    if (!isProductExist || !isProductExist.stock) {
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
      // console.log('no cart found');
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
      const productIndex = userCart.items!.findIndex((item) => {
        return item.product.equals(product);
      }) as number;
      if (productIndex == -1) {
        userCart.items?.push({
          product: product,
          quantity: quantity,
        });
        // await userCart.save();
      } else {
        const foundItem = userCart.items![productIndex];
        // console.log(foundItem);
        let totalQuantity = quantity + foundItem.quantity;
        if (totalQuantity > (isProductExist.stock || 0)) {
          totalQuantity = isProductExist.stock || 0;
          throw new NotFoundException(
            `only availabe stock is ${isProductExist.stock}`,
          );
        } else {
          foundItem.quantity = totalQuantity;
          // await userCart.save();
        }
      }
    }
    await userCart.save();

    return {
      data: userCart,
    };
  }
}
