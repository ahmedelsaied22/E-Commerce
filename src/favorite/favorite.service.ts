/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/db/models/user.model';
import { ProductRepo } from 'src/db/repo/product.repo';
import { UserRepo } from 'src/db/repo/user.repo';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async favoriteToggle({
    productId,
    user,
  }: {
    productId: Types.ObjectId;
    user: Partial<User>;
  }) {
    const product = await this.productRepo.findById({ id: productId });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    if (user.favorites == undefined) {
      user.favorites = [productId];
      await user.save();
      return {
        msg: 'adding product to favorites',
      };
    }
    const index = user.favorites.findIndex((prod) => {
      return prod._id.toString() == productId.toString();
    });
    if (index == -1) {
      user.favorites?.push(productId);
      await user.save();
      return {
        msg: 'adding product to favorites',
      };
    } else {
      user.favorites?.splice(index, 1);
      await user.save();
      return {
        msg: 'delete product from favorites',
      };
    }
  }
}
