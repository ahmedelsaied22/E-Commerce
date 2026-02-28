import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.services';
import { UserModel } from 'src/db/models/user.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { OTPRepo } from 'src/db/repo/otp.repo';
import { OTPModel } from 'src/db/models/otp.model';
import { OTPService } from 'src/common/utils/email/createOTP';
import { JWTService } from 'src/common/utils/security/token';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [UserModel, OTPModel],
  controllers: [AuthController],
  providers: [
    AuthService,
    OTPService,
    UserRepo,
    OTPRepo,
    JWTService,
    JwtService,
    AuthGuard,
  ],
})
export class AuthModule {}
