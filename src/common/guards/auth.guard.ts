/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { JWTService } from '../utils/security/token';
import { Types } from 'mongoose';
import { UserRepo } from 'src/db/repo/user.repo';
import { User } from 'src/db/models/user.model';

export interface AuthReq extends Request {
  user: Partial<User>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly userModel: UserRepo,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: AuthReq = context.switchToHttp().getRequest();
      const auth = req.headers['authorization'];

      if (!auth.startsWith(process.env.BEARER as string)) {
        throw new BadRequestException('in-valid token');
      }
      const token = auth.split(' ')[1];
      const payload: {
        _id: Types.ObjectId;
        email: string;
      } = await this.jwtService.verify({
        token,
        options: {
          secret: process.env.SECRET,
        },
      });
      const user = await this.userModel.findById({
        id: payload._id,
      });
      if (!user) {
        throw new BadRequestException('user is deleted');
      }
      if (!user.isConfirmed) {
        throw new BadRequestException('email not confirmed');
      }
      req.user = user;
      return true;
    } catch (err) {
      throw new BadRequestException({ AuthErr: err });
    }
  }
}
