import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { deleteImage } from 'src/common/utils/multer/deleteImage';
import { BrandRepo } from 'src/db/repo/brand.repo';

@Injectable()
export class BrandService {
  constructor(private readonly brandModel: BrandRepo) {}

  async createBrand(data: {
    name: string;
    // image: string;
    createdBy?: Types.ObjectId;
    slug: string;
  }) {
    const brand = await this.brandModel.findOne({
      filter: {
        name: data.name,
      },
    });
    if (brand) {
      throw new BadRequestException('this brand already exist');
    }
    const newBrand = await this.brandModel.create({
      data: {
        name: data.name,
        // image: data.image,
        createdBy: data.createdBy,
        slug: data.name,
      },
    });
    return {
      data: {
        newBrand,
      },
    };
  }

  async updateBrand(data: {
    name: string;
    // image: string;
    createdBy?: Types.ObjectId;
  }) {
    const brand = await this.brandModel.findOne({
      filter: {
        name: data.name,
      },
    });
    if (!brand) {
      throw new BadRequestException('this brand not exist');
    }
    if (brand.image) {
      await deleteImage(brand.image);
    }
    if (
      (data.createdBy?.toString() as string) !=
      (brand.createdBy?.toString() as string)
    ) {
      throw new BadRequestException('you don`t have authorization');
    }
    brand.name = data.name || brand.name;
    brand.slug = data.name || brand.name;
    // brand.image = data.image || brand.image;

    await brand.save();

    return {
      data: {},
    };
  }
}
