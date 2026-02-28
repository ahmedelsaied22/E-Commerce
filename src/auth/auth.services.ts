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
import { customAlphabet } from 'nanoid';
import { JWTService } from 'src/common/utils/security/token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UserRepo,
    private readonly otpService: OTPService,
    private readonly otpModel: OTPRepo,
    private readonly jwtService: JWTService,
  ) {}
  async signup(body: RequestBody) {
    const { data } = body;
    const { name, email, password, age, gender } = data;
    const userExist = await this.userModel.findOne({ filter: { email } });

    if (userExist) {
      return new BadRequestException('email already exists');
    }
    const user = await this.userModel.create({
      data: {
        name,
        email,
        password: await createHash(password?.toString()),
        age,
        gender,
      },
    });
    const nanoid = customAlphabet('0123456789', 6);
    const MakeOtp = nanoid();
    const errorOtp = await this.otpModel.create({
      data: {
        userId: user._id,
        type: OTPTypeEnum.VERIFY_EMAIL,
        otp: await createHash(MakeOtp),
        expiredAt: new Date(Date.now() + 60 * 1000),
      },
    });
    console.log(errorOtp);
    // console.log('before creating otp');
    // const otp = await this.otpService.createOTP({
    //   type: OTPTypeEnum.VERIFY_EMAIL,
    //   userId: user._id,
    // });
    // console.log('after creating otp');

    emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
      to: user.email,
      subject: 'verify your email',
      html: template({
        otp: MakeOtp,
        name: user.name as string,
        subject: 'verify your email',
      }),
    });
    return {
      data: {},
    };
  }

  async confirmEmail({ email, otp }: { otp: string; email: string }) {
    // console.log({ OTPRepo });
    // console.log(this.otpModel);
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
    const otpExist = await this.otpModel.findOne({
      filter: {
        userId: isEmailExist._id,
        type: OTPTypeEnum.VERIFY_EMAIL,
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

    // await this.otpService.validateOtp({
    //   otp,
    //   userId: isEmailExist._id,
    //   type: OTPTypeEnum.VERIFY_EMAIL,
    // });
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
    const newOTP = await this.otpService.createOTP({
      type: OTPTypeEnum.VERIFY_EMAIL,
      userId: isEmailExist._id,
    });
    emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
      to: isEmailExist.email,
      subject: 'verify your email',
      html: template({
        otp: newOTP as string,
        name: isEmailExist.name as string,
        subject: 'verify your email',
      }),
    });
    return {
      data: {},
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
    const token = this.jwtService.sign({
      payload,
      options: {
        expiresIn: '15 M',
        secret: process.env.SECRET,
      },
    });
    return {
      data: { accessToken: token },
    };
  }
}
