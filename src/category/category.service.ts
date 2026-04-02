import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepo } from 'src/db/repo/category.reqo';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory(data: {
    name: string;
    // image: {
    //   secure_url: string;
    //   public_id: string;
    // };
    createdBy?: Types.ObjectId;
    slug: string;
  }) {
    const category = await this.categoryRepo.findOne({
      filter: {
        name: data.name,
      },
    });
    if (category) {
      throw new BadRequestException('category already exist');
    }
    const newCategory = await this.categoryRepo.create({
      data: {
        name: data.name,
        // image: data.image,
        createdBy: data.createdBy,
        slug: data.slug,
      },
    });
    return {
      data: { newCategory },
    };
  }

  async getAllCategories() {
    const categories = await this.categoryRepo.find({});
    return {
      categories,
    };
  }
}
