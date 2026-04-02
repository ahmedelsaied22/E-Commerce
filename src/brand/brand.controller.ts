import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { UserRepo } from 'src/db/repo/user.repo';
import { BrandRepo } from 'src/db/repo/brand.repo';
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly userModel: UserRepo,
    private readonly brandModel: BrandRepo,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-brand')
  async createBrand(
    @Body()
    body: {
      name: string;
      createdBy: Types.ObjectId;
      slug: string;
    },
    @Req() req: AuthReq,
  ) {
    const user = await this.userModel.findOne({
      filter: {
        email: req.user.email,
      },
    });
    const data = {
      name: body.name,
      createdBy: user?._id,
      slug: body.name,
    };
    console.log({ data });
    return await this.brandService.createBrand(data);
  }

  @UseGuards(AuthGuard)
  @Post('update-brand')
  async updateBrand(
    @Body()
    body: {
      name: string;
      // slug: string;
      createdBy: Types.ObjectId;
    },
    @Req() req: AuthReq,
  ) {
    const user = await this.userModel.findOne({
      filter: {
        email: req.user.email,
      },
    });
    const data = {
      name: body.name,
      slug: body.name,
      createdBy: user?._id,
    };
    return await this.brandService.updateBrand(data);
  }
}
