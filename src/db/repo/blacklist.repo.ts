import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { TokenBlackList } from '../models/blackListToken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlacklistRepo extends DBRepo<TokenBlackList> {
  constructor(
    @InjectModel(TokenBlackList.name)
    private readonly blacklist: Model<TokenBlackList>,
  ) {
    super(blacklist);
  }
}
