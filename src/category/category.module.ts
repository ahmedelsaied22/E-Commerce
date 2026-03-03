import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryModel } from 'src/db/models/category.model';
import { JWTService } from 'src/common/utils/security/token';
import { JwtService as JWT } from '@nestjs/jwt';
import { UserRepo } from 'src/db/repo/user.repo';
import { UserModel } from 'src/db/models/user.model';
import { CategoryRepo } from 'src/db/repo/category.reqo';

@Module({
  imports: [CategoryModel, UserModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo, JWT, JWTService, UserRepo],
  exports: [CategoryService, CategoryRepo, JWTService, UserRepo],
})
export class CategoryModule {}
