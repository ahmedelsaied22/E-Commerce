import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/multer/upload';
import { Types } from 'mongoose';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { UserRepo } from 'src/db/repo/user.repo';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userRepo: UserRepo,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('category', {
      storage: storage('src/uploads/category'),
    }),
  )
  @Post('')
  async createCategory(
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
    const user = await this.userRepo.findOne({
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
    return this.categoryService.createCategory(data);
  }

  @Get('')
  async getAllCategories() {
    return {
      data: await this.categoryService.getAllCategories(),
    };
  }
}
