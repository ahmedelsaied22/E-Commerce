/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OTPService } from 'src/common/utils/email/createOTP';
import {
  EMAIL_EVENTS_ENUM,
  emailEmitter,
} from 'src/common/utils/email/email.events';
import { template } from 'src/common/utils/email/generateHTML';
import { compareHash, createHash } from 'src/common/utils/security/hash';
import { OTPTypeEnum } from 'src/db/models/otp.model';
import { UserRepo } from 'src/db/repo/user.repo';
import { RequestBody } from './auth.controller';
import { OTPRepo } from 'src/db/repo/otp.repo';
import { JWTService } from 'src/common/utils/security/token';
import { sendEmail } from 'src/common/utils/email/sendEmail';
import { customAlphabet } from 'nanoid';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OTPService,
    private readonly otpRepo: OTPRepo,
    private readonly userModel: UserRepo,
    private readonly jwtService: JWTService,
  ) {}
  async signup(body: RequestBody) {
    const { data } = body;
    const { name, email, password, age, gender, role } = data;
    const userExist = await this.userModel.findOne({ filter: { email } });

    if (userExist) {
      throw new BadRequestException('email already exists');
    }
    const user = await this.userModel.create({
      data: {
        name,
        email,
        password: await createHash(password?.toString()),
        age,
        gender,
        role,
        refreshToken: '',
      },
    });
    const nanoid = customAlphabet('0123456789', 6);
    const createOtp = nanoid();
    await this.otpRepo.create({
      data: {
        userId: user._id,
        type: OTPTypeEnum.VERIFY_EMAIL,
        otp: await createHash(createOtp),
        expiredAt: new Date(Date.now() + 60 * 1000),
      },
    });

    sendEmail({
      to: user.email as string,
      html: template({
        otp: createOtp as string,
        name: user.name as string,
        subject: 'verify your email',
      }),
    });
    return {
      data: user,
    };
  }

  async confirmEmail({ email, otp }: { otp: string; email: string }) {
    const isEmailExist = await this.userModel.findOne({
      filter: {
        email,
      },
    });
    if (!isEmailExist) {
      throw new NotFoundException('email not found');
    }
    if (isEmailExist.isConfirmed) {
      throw new BadRequestException('your eamil already confirmed');
    }
    // validateOtp
    const otpExist = await this.otpRepo.findOne({
      filter: {
        userId: isEmailExist._id,
        type: OTPTypeEnum.VERIFY_EMAIL,
        expiredAt: {
          $gte: Date.now(),
        },
      },
    });
    if (!otpExist) {
      return new NotFoundException('otp not found');
    }
    if (
      new Date(otpExist.expiredAt?.toString() as string) <= new Date(Date.now())
    ) {
      throw new BadRequestException('otp expired, send another otp');
    }
    if (!(await compareHash(otp, otpExist.otp as string))) {
      throw new BadRequestException('try otp again');
    }
    isEmailExist.isConfirmed = true;
    await isEmailExist.save();
    return {
      data: {},
    };
  }

  async resendOTP(email: string) {
    const isEmailExist = await this.userModel.findOne({
      filter: {
        email,
      },
    });
    if (!isEmailExist) {
      throw new NotFoundException('Email not found');
    }
    // const newOTP = await this.otpService.createOTP({
    //   type: OTPTypeEnum.VERIFY_EMAIL,
    //   userId: isEmailExist._id,
    // });

    const isOtpExist: any = await this.otpRepo.findOne({
      filter: {
        type: OTPTypeEnum.VERIFY_EMAIL,
      },
    });
    const nanoid = customAlphabet('0123456789', 6);
    const createOtp = nanoid();
    if (isOtpExist && isOtpExist?.expiredAt >= Date.now()) {
      throw new BadRequestException('otp already sent');
    }
    const newOTP = await this.otpRepo.create({
      data: {
        userId: isEmailExist._id,
        type: OTPTypeEnum.VERIFY_EMAIL,
        otp: await createHash(createOtp),
        expiredAt: new Date(Date.now() + 60 * 1000),
      },
    });
    emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
      to: isEmailExist.email,
      subject: 'verify your email',
      html: template({
        otp: createOtp as string,
        name: isEmailExist.name as string,
        subject: 'verify your email',
      }),
    });

    return {
      msg: 'success sending OTP',
      data: { newOTP },
    };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.findOne({
      filter: {
        email,
      },
    });
    if (
      !user ||
      !(await compareHash(password, user.password?.toString() as string))
    ) {
      throw new BadRequestException('in-valid credintials');
    }
    const payload = {
      email: user.email,
      _id: user._id,
    };
    const accessToken = this.jwtService.sign({
      payload,
      options: {
        expiresIn: '2 H',
        secret: process.env.SECRET_ACCESS_TOKEN,
      },
    });
    const refreshToken = this.jwtService.sign({
      payload,
      options: {
        expiresIn: '7 D',
        secret: process.env.SECRET_REFRESH_TOKEN,
      },
    });
    user.refreshToken = await createHash(refreshToken);
    await user.save();
    return {
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const userInfo: {
      _id: Types.ObjectId;
      email: string;
    } = await this.jwtService.verify({
      token: refreshToken,
      options: {
        secret: process.env.SECRET_REFRESH_TOKEN as string,
      },
    });
    const isUserExist = await this.userModel.findById({
      id: userInfo._id,
    });
    if (!isUserExist) {
      throw new NotFoundException('user is deleted');
    }
    const isRefreshToken = await compareHash(
      refreshToken,
      isUserExist!.refreshToken as string,
    );
    if (!isRefreshToken) throw new BadRequestException('in-valid refreshToken');
    const accessToken = this.jwtService.sign({
      payload: {
        _id: userInfo._id,
        email: userInfo.email,
      },
      options: {
        expiresIn: '1 H',
        secret: process.env.SECRET_ACCESS_TOKEN as string,
      },
    });

    return {
      data: {
        accessToken: accessToken,
      },
    };
  }
}
