/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { storage } from 'src/common/utils/multer/upload';
import { Product } from 'src/db/models/product.model';
import { Query as Q, Types } from 'mongoose';
import { UserRepo } from 'src/db/repo/user.repo';
import { ProductRepo } from 'src/db/repo/product.repo';
import * as fs from 'fs';
import { FilteringProductDTO } from './productDto/product.dto';

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
      storage: storage('src/uploads/products'),
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
    console.log(isProductExist);
    if (isProductExist) {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      throw new BadRequestException('product already exist');
    }
    const user = await this.userRepo.findOne({
      filter: {
        email: req.user.email,
      },
    });

    console.log(isProductExist);
    data.createdBy = user?._id;
    data.images = files.map((file) => file.path);

    return {
      data: this.productService.createProduct(data),
    };
  }

  // @Get('')
  // async getAllProducts(@Query() query: FilteringProductDTO) {
  //   const { category, minPrice, maxPrice } = query;
  //   return await this.productService.getAllProducts({
  //     category,
  //     minPrice,
  //     maxPrice,
  //   });
  // }
}
