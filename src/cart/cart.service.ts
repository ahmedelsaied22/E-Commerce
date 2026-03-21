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

  async deleteFromCart({
    userId,
    product,
  }: {
    userId: Types.ObjectId;
    product: Types.ObjectId;
  }) {
    const isProductExist = await this.productRepo.findById({
      id: product,
    });
    if (!isProductExist) {
      throw new NotFoundException('product not found');
    }
    const userCart = await this.cartRepo.findOne({
      filter: {
        userId,
      },
    });
    if (!userCart || !userCart.items) {
      throw new NotFoundException('your cart is empty');
    }

    const productIndex: number = userCart.items!.findIndex((item) => {
      return item.product == product;
    });

    if (productIndex == -1) {
      throw new NotFoundException('product not found in your cart');
    }

    userCart.items![productIndex].quantity -= 1;
    if (userCart.items[productIndex].quantity == 0) {
      userCart.items.splice(productIndex, 1);
      await userCart.save();
      throw new NotFoundException('this product quantity in your cart is 0');
    }
    await userCart.save();

    return {
      data: userCart,
    };
  }
}
