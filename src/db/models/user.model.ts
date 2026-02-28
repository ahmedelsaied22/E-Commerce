import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  name!: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  password!: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    min: 18,
    max: 60,
  })
  age!: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: GenderEnum.MALE,
  })
  gender!: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isConfirmed!: boolean;
}
export const userShcema = SchemaFactory.createForClass(User);

export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userShcema,
  },
]);
