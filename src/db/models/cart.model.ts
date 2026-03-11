import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
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
}

export const CartShcema = SchemaFactory.createForClass(Cart);

export const CartModel = MongooseModule.forFeature([
  {
    schema: CartShcema,
    name: Cart.name,
  },
]);
