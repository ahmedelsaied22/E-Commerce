import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponModel } from 'src/db/models/coupon.model';
import { CouponRepo } from 'src/db/repo/coupon.repo';
import { JWTService } from 'src/common/utils/security/token';
import { JwtService as JWT } from '@nestjs/jwt';
import { UserRepo } from 'src/db/repo/user.repo';
import { UserModel } from 'src/db/models/user.model';

@Module({
  imports: [CouponModel, UserModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepo, JWTService, JWT, UserRepo],
})
export class CouponModule {}
