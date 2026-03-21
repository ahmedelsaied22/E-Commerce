import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { UserModel } from 'src/db/models/user.model';
import { ProductModel } from 'src/db/models/product.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { ProductRepo } from 'src/db/repo/product.repo';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/utils/security/token';

@Module({
  imports: [UserModel, ProductModel],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    UserRepo,
    ProductRepo,
    JWTService,
    JWT,
  ],
})
export class FavoriteModule {}
