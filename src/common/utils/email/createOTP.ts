import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OTPRepo } from 'src/db/repo/otp.repo';
import { customAlphabet } from 'nanoid';
import { OTPTypeEnum } from 'src/db/models/otp.model';
import { compareHash } from '../security/hash';

export class OTPService {
  constructor(private readonly otpRepo: OTPRepo) {}

  async createOTP({
    type = OTPTypeEnum.VERIFY_EMAIL,
    userId,
  }: {
    userId: Types.ObjectId;
    type?: OTPTypeEnum;
  }) {
    const nanoid = customAlphabet('0123456789', 6);
    const otp = nanoid();
    const isOtpExist = await this.otpRepo.findOne({
      filter: {
        userId,
        type: OTPTypeEnum.VERIFY_EMAIL,
      },
    });
    console.log(isOtpExist);
    if (
      isOtpExist &&
      new Date(isOtpExist.expiredAt?.toString() as string) >=
        new Date(Date.now())
    ) {
      return new BadRequestException(
        'otp already sent, please try again later.',
      );
    }

    console.log({
      userId,
      type,
      otp,
      expiredAt: new Date(Date.now() + 60 * 1000),
    });

    // await this.otpModel.create({
    //   data: {
    //     userId,
    //     type,
    //     otp: await createHash(otp),
    //     expiredAt: new Date(Date.now() + 60 * 1000),
    //   },
    // });
    console.log('finally otp created from createOtp');
    if (!isOtpExist) {
      return otp;
    }
    // isOtpExist.otp = await createHash(otp);
    // isOtpExist.expiredAt = new Date(Date.now() + 60 * 1000);
    return otp;
  }

  async validateOtp({
    otp,
    userId,
    type,
  }: {
    otp: string;
    userId: Types.ObjectId;
    type: OTPTypeEnum;
  }) {
    console.log({ OTPRepo });
    console.log(this.otpRepo);
    const otpExist = await this.otpRepo.findOne({
      filter: {
        userId,
        type,
      },
    });
    if (!otpExist) {
      return new NotFoundException('otp not found');
    }
    if (
      new Date(otpExist.expiredAt?.toString() as string) <= new Date(Date.now())
    ) {
      return new BadRequestException('otp expired, send another otp');
    }
    console.log(!(await compareHash(otp, otpExist.otp as string)));
    if (!(await compareHash(otp, otpExist.otp as string))) {
      throw new BadRequestException('try otp again');
    }
  }
}
