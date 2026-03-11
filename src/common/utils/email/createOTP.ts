/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OTPRepo } from 'src/db/repo/otp.repo';
import { customAlphabet } from 'nanoid';
import { OTPTypeEnum } from 'src/db/models/otp.model';
import { compareHash, createHash } from '../security/hash';
import { UserRepo } from 'src/db/repo/user.repo';

export class OTPService {
  constructor(
    private readonly otpRepo: OTPRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async createOTP({
    type = OTPTypeEnum.VERIFY_EMAIL,
    userId,
  }: {
    type?: OTPTypeEnum;
    userId: Types.ObjectId;
  }) {
    const nanoid = customAlphabet('0123456789', 6);
    const otp = nanoid();

    console.log({
      userId,
      type,
      otp,
      expiredAt: new Date(Date.now() + 60 * 1000),
    });

    const allUsers = await this.userRepo.find({});
    console.log(allUsers);

    const isOtpExist = await this.otpRepo.findOne({
      filter: {
        userId,
        type: OTPTypeEnum.VERIFY_EMAIL,
      },
    });
    if (!isOtpExist || isOtpExist == undefined) {
      console.log(1);
      console.log(this.otpRepo);
      await this.otpRepo.create({
        data: {
          userId: userId as Types.ObjectId,
          type,
          otp: await createHash(otp),
          expiredAt: new Date(Date.now() + 60 * 1000),
        },
      });
      return otp;
    }

    isOtpExist.otp = await createHash(otp);
    isOtpExist.expiredAt = new Date(Date.now() + 60 * 1000);
    await isOtpExist.save();
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
