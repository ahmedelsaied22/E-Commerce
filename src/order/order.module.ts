import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderModel } from 'src/db/models/order.model';
import { OrderRepo } from 'src/db/repo/order.repo';
import { CartModel } from 'src/db/models/cart.model';
import { CartRepo } from 'src/db/repo/cart.repo';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/utils/security/token';
import { ProductModel } from 'src/db/models/product.model';
import { ProductRepo } from 'src/db/repo/product.repo';
import { UserModel } from 'src/db/models/user.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { CouponRepo } from 'src/db/repo/coupon.repo';
import { CouponModel } from 'src/db/models/coupon.model';

@Module({
  imports: [OrderModel, CartModel, ProductModel, UserModel, CouponModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepo,
    CartRepo,
    JWTService,
    JWT,
    ProductRepo,
    UserRepo,
    CouponRepo,
  ],
})
export class OrderModule {}
