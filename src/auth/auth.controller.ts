/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/require-await */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { AuthService } from './auth.services';
import { SignupSchema } from './authValidation/signup.schema';
import { AuthGuard, type AuthReq } from 'src/common/guards/auth.guard';

export interface RequestBody {
  success: boolean;
  data: {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
  };
}

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodPipe(SignupSchema))
  // @UsePipes(new ZodPipe(OTPShema))
  signup(@Body() body: RequestBody) {
    return this.authService.signup(body);
  }

  @Post('confirm-email')
  confirmEmail(@Body() { otp, email }: { otp: string; email: string }) {
    return this.authService.confirmEmail({ otp, email });
  }

  @Post('resend-otp')
  resendOTP(@Body() email: string) {
    return this.authService.resendOTP(email);
  }

  @Get('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login({ email, password });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  me(@Req() { user }) {
    return { data: user };
  }

  @Post('log-out')
  @UseGuards(AuthGuard)
  async logout() {
    return {
      msg: 'logged out successfully',
      data: {},
    };
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: AuthReq) {
    const refreshToken = req.body!['refreshToken'];
    if (!refreshToken.startsWith(process.env.BEARER as string)) {
      throw new BadRequestException('in-valid token');
    }
    const token = refreshToken.split(' ')[1];
    return await this.authService.refreshToken(token);
  }
}
