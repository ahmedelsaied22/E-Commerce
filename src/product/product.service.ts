/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

  async getAllProducts(filterProduct: {
    category: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
  }) {
    const { category, brand, minPrice, maxPrice } = filterProduct;
    const filter: any = {};
    if (category) {
      const categoryExist = await this.categoryRepo.findOne({
        filter: {
          slug: category,
        },
      });
      filter.category = categoryExist?._id.toString();
    }
    if (brand) {
      const brandExist = await this.brandRepo.findOne({
        filter: {
          slug: brand,
        },
      });
      filter.brand = brandExist?._id.toString();
    }
    if (minPrice || maxPrice) {
      filter.salePrice = {};
      if (minPrice) filter.salePrice.$gte = Number(minPrice);
      if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
    }
    const allProducts = await this.productRepo.find({
      filter,
      options: {
        populate: [
          {
            path: 'createdBy',
            select: 'name email',
          },
          {
            path: 'brand',
            select: 'slug',
          },
          {
            path: 'category',
            select: 'slug',
          },
        ],
      },
    });

    return {
      data: { allProducts },
    };
  }
}
