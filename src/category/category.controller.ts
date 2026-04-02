import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { storage } from 'src/common/utils/multer/upload';
import { Types } from 'mongoose';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { UserRepo } from 'src/db/repo/user.repo';
import { CategoryService } from './category.service';
// import { memoryStorage } from 'multer';
// import { uploadSingleFile } from 'src/upload/cloud.services';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userRepo: UserRepo,
  ) {}

  @UseGuards(AuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('category', {
  //     storage: memoryStorage(),
  //   }),
  // )
  @Post('')
  async createCategory(
    @Body()
    body: {
      name: string;
      image: {
        secure_url: string;
        public_id: string;
      };
      createdBy: Types.ObjectId;
      slug: string;
    },
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthReq,
  ) {
    if (!file) {
      throw new BadRequestException('image is required');
    }
    const user = await this.userRepo.findOne({
      filter: {
        email: req.user.email,
      },
    });
    // const image = await uploadSingleFile({ file });
    const data = {
      name: body.name,
      // image: image,
      createdBy: user?._id,
      slug: body.name,
    };
    return await this.categoryService.createCategory(data);
  }

  @Get('')
  async getAllCategories() {
    return {
      data: await this.categoryService.getAllCategories(),
    };
  }
}
