import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';

export enum OTPTypeEnum {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Schema({
  timestamps: true,
})
export class OTP {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  otp!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OTPTypeEnum),
  })
  type!: OTPTypeEnum;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt!: Date;

  // @Prop({
  //   default: Date.now,
  //   expires: 60,
  // })
  // createdAt?: Date;
}

export type OTPDocument = HydratedDocument<OTP>;

export const OTPShcema = SchemaFactory.createForClass(OTP);
OTPShcema.index(
  {
    userId: 1,
    type: 1,
  },
  {
    unique: true,
    expires: 1 * 1000 * 60,
  },
);
OTPShcema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const OTPModel = MongooseModule.forFeature([
  {
    name: OTP.name,
    schema: OTPShcema,
  },
]);
