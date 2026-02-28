import { DBRepo } from './db.repo';
import { OTP } from '../models/otp.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OTPRepo extends DBRepo<OTP> {
  constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) {
    super(otpModel);
  }
}
