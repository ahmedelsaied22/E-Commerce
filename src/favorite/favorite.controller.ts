/* eslint-disable @typescript-eslint/require-await */

import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';
import { Types } from 'mongoose';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteServices: FavoriteService) {}

  @Post('favorite-toggle/:id')
  @UseGuards(AuthGuard)
  async favoriteToggle(@Req() req: AuthReq, @Param('id') id: string) {
    const user = req.user;
    const productId = new Types.ObjectId(id);

    return {
      data: this.favoriteServices.favoriteToggle({ productId, user }),
    };
  }
}
