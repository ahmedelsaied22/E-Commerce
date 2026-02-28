import {
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
import { AuthGuard } from 'src/common/guards/auth.guard';

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

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() { user }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { data: user };
  }
}
