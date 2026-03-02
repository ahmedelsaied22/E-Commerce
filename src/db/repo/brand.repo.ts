import { Model } from 'mongoose';
import { DBRepo } from './db.repo';
import { Brand } from '../models/brand.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandRepo extends DBRepo<Brand> {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {
    super(brandModel);
  }
}
