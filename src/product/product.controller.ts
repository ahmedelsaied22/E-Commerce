import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Product } from 'src/db/models/product.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { ProductRepo } from 'src/db/repo/product.repo';
import { RoleEnum } from 'src/db/models/user.model';
import { memoryStorage } from 'multer';
import { deleteImage, uploadMultipleFiles } from 'src/upload/cloud.services';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productRepo: ProductRepo,
    private readonly userRepo: UserRepo,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  @Post('create-product')
  async createProduct(
    @Body() data: Partial<Product>,
    @Req() req: AuthReq,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const isProductExist = await this.productRepo.findOne({
      filter: {
        name: data.name,
      },
    });
    if (isProductExist) {
      throw new BadRequestException('product already exist');
    }
    const user = await this.userRepo.findOne({
      filter: {
        email: req.user.email,
        role: RoleEnum.ADMIN,
      },
    });

    data.createdBy = user?._id;
    if (data.images) {
      data.images = await uploadMultipleFiles({ files });
    } else {
      data.images = [];
    }
    return {
      data: this.productService.createProduct(data),
    };
  }

  @Delete('delete-product/:id')
  async deleteProduct(@Param('id') productId: Types.ObjectId) {
    console.log(productId);
    const productExist = await this.productRepo.findById({
      id: productId,
    });
    if (!productExist) {
      throw new NotFoundException('product already not found');
    }
    console.log(productExist);
    const images = productExist.images;
    if (images) {
      for (const image of images) {
        await deleteImage(image.public_id);
      }
    }
    await this.productRepo.deleteOne({
      filter: {
        id: productId,
      },
    });
    return {
      data: {},
    };
  }

  @Get('')
  async getAllProducts(
    @Query()
    query: {
      category: string;
      brand: string;
      minPrice: number;
      maxPrice: number;
    },
  ) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
    }: {
      category: string;
      brand: string;
      minPrice: number;
      maxPrice: number;
    } = query;
    return await this.productService.getAllProducts({
      category,
      brand,
      minPrice,
      maxPrice,
    });
  }
}
