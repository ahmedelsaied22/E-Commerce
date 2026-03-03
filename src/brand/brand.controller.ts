import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { UserRepo } from 'src/db/repo/user.repo';
import { BrandRepo } from 'src/db/repo/brand.repo';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/multer/upload';
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly userModel: UserRepo,
    private readonly brandModel: BrandRepo,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage('src/uploads/brand'),
    }),
  )
  @Post('create-brand')
  async createBrand(
    @Body()
    body: {
      name: string;
      image: string;
      createdBy: Types.ObjectId;
      slug: string;
    },
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthReq,
  ) {
    if (!file) {
      throw new BadRequestException('image is required');
    }
    const user = await this.userModel.findOne({
      filter: {
        email: req.user.email,
      },
    });
    const data = {
      name: body.name,
      image: file.path,
      createdBy: user?._id,
      slug: body.name,
    };
    console.log({ data });
    return this.brandService.createBrand(data);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage('src/uploads/brand'),
    }),
  )
  @Post('update-brand')
  async updateBrand(
    @Body()
    body: {
      name: string;
      // slug: string;
      image: string;
      createdBy: Types.ObjectId;
    },
    @Req() req: AuthReq,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('image is required');
    }
    const user = await this.userModel.findOne({
      filter: {
        email: req.user.email,
      },
    });
    const data = {
      name: body.name,
      slug: body.name,
      image: file.path,
      createdBy: user?._id,
    };
    return this.brandService.updateBrand(data);
  }
}
