import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UserModel } from 'src/db/models/user.model';
import { BrandModel } from 'src/db/models/brand.model';
import { CategoryModel } from 'src/db/models/category.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { BrandRepo } from 'src/db/repo/brand.repo';
import { CategoryRepo } from 'src/db/repo/category.reqo';
import { JWTService } from 'src/common/utils/security/token';
import { JwtService as JWT } from '@nestjs/jwt';
import { ProductRepo } from 'src/db/repo/product.repo';
import { ProductModel } from 'src/db/models/product.model';

@Module({
  imports: [ProductModel, UserModel, BrandModel, CategoryModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepo,
    UserRepo,
    BrandRepo,
    CategoryRepo,
    JWTService,
    JWT,
  ],
  exports: [ProductRepo, BrandRepo, UserRepo, CategoryRepo],
})
export class ProductModule {}
