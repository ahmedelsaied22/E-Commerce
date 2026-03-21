import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class TokenBlackList {
  @Prop({
    type: String,
    required: true,
  })
  token?: string;

  @Prop({
    type: Date,
  })
  expiredAt!: Date;
}

export const tokenBlacklistSchema =
  SchemaFactory.createForClass(TokenBlackList);

tokenBlacklistSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const tokenBlackListModel = MongooseModule.forFeature([
  {
    name: TokenBlackList.name,
    schema: tokenBlacklistSchema,
  },
]);
