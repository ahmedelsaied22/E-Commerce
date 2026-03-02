import { IsString } from 'class-validator';
// import { Types } from 'mongoose';

export class CreateBrandDTO {
  @IsString()
  name!: string;

  // @IsString()
  // slug?: string;

  // @IsString()
  // image!: string;

  // @IsString()
  // createdBy!: Types.ObjectId;
}
