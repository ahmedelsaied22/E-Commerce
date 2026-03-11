import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

export enum PaymentMethodEnum {
  CARD = 'card',
  CASH = 'cash',
}

export enum OrderStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          required: true,
          ref: Product.name,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    default: [],
  })
  items!: {
    product: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  supTotal!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discount!: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  total!: number;

  @Prop({
    type: String,
    required: true,
  })
  address!: string;

  @Prop({
    type: [String],
  })
  instructions!: string[];

  @Prop({
    type: String,
    required: true,
  })
  phone!: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentMethodEnum),
  })
  paymentMethod!: PaymentMethodEnum;

  @Prop({
    type: String,
    enum: Object.values(OrderStatusEnum),
  })
  orderStatus!: OrderStatusEnum;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);
