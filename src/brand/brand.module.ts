import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandModel } from 'src/db/models/brand.model';
import { BrandRepo } from 'src/db/repo/brand.repo';
import { BrandService } from './brand.service';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/utils/security/token';
import { UserRepo } from 'src/db/repo/user.repo';
import { UserModel } from 'src/db/models/user.model';

@Module({
  imports: [BrandModel, UserModel],
  controllers: [BrandController],
  providers: [BrandService, BrandRepo, JWT, JWTService, UserRepo],
  exports: [BrandRepo, JWTService, UserRepo],
})
export class BrandModule {}
