import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  code!: string;

  @Prop({
    type: Number,
    required: true,
    default: 10,
  })
  discount!: number;

  @Prop({
    type: Date,
    required: true,
    default: new Date(Date.now() + 24 * 0 * 60 * 1000),
  })
  expiredAt!: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  totalUses!: number;

  @Prop({
    type: Number,
    default: 10,
  })
  maxCount!: number;
}

export const CouponShcema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: CouponShcema,
  },
]);
