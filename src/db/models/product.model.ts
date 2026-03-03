import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Brand } from './brand.model';
import { Category } from './category.model';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  slug?: string;

  @Prop({
    type: [String],
    required: true,
  })
  images!: string[];

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
  })
  brand!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category!: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
  })
  discount!: number;

  @Prop({
    type: Number,
    required: true,
  })
  originalPrice!: number;

  @Prop({
    type: Number,
  })
  salePrice?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  stock!: number;

  @Prop({
    type: String,
    required: true,
  })
  description!: string;

  @Prop({
    type: Number,
    default: 0,
  })
  soldItems!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set('optimisticConcurrency', true);

export const ProductModel = MongooseModule.forFeature([
  {
    schema: ProductSchema,
    name: Product.name,
  },
]);

ProductSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
    });
  }
});

ProductSchema.pre('save', function () {
  this.salePrice =
    this.originalPrice - ((this.originalPrice * this.discount) / 100 || 0);
});
