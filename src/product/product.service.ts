import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Product } from 'src/db/models/product.model';
import { BrandRepo } from 'src/db/repo/brand.repo';
import { CategoryRepo } from 'src/db/repo/category.reqo';
import { ProductRepo } from 'src/db/repo/product.repo';
import { UserRepo } from 'src/db/repo/user.repo';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly userRepo: UserRepo,
    private readonly brandRepo: BrandRepo,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  async createProduct(data: Partial<Product>) {
    const [category, brand] = await Promise.all([
      this.categoryRepo.findById({
        id: data.category as unknown as Types.ObjectId,
      }),
      this.brandRepo.findById({
        id: data.brand as unknown as Types.ObjectId,
      }),
    ]);
    if (!category) {
      throw new BadRequestException('category is not exist');
    }
    if (!brand) {
      throw new BadRequestException('brand is not exist');
    }
    const newProduct = await this.productRepo.create({
      data,
    });
    return {
      data: {
        newProduct,
      },
    };
  }

  async getAllProducts() {
    const allProducts = await this.productRepo.find({});

    return {
      data: { allProducts },
    };
  }
}
