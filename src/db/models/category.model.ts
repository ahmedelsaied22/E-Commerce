import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
})
export class Category {
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
  slug!: string;

  @Prop({
    type: String,
  })
  image!: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy!: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('optimisticConcurrency', true);

export const CategoryModel = MongooseModule.forFeature([
  {
    schema: CategorySchema,
    name: Category.name,
  },
]);

CategorySchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
    });
  }
});
