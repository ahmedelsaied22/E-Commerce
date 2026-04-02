import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from 'src/db/models/cart.model';
import { CartRepo } from 'src/db/repo/cart.repo';
import { ProductModel } from 'src/db/models/product.model';
import { ProductRepo } from 'src/db/repo/product.repo';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/utils/security/token';
import { UserModel } from 'src/db/models/user.model';
import { UserRepo } from 'src/db/repo/user.repo';

@Module({
  imports: [CartModel, ProductModel, UserModel],
  controllers: [CartController],
  providers: [CartService, CartRepo, ProductRepo, JWT, JWTService, UserRepo],
})
export class CartModule {}
