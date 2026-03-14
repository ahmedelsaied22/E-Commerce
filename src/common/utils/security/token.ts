/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private readonly JWT: JwtService) {}

  sign({ payload, options = {} }: { payload: any; options?: JwtSignOptions }) {
    const token = this.JWT.sign(payload, options);
    return token;
  }

  verify({ token, options }: { token: string; options: JwtVerifyOptions }) {
    const result = this.JWT.verify(token, options);
    return result;
  }
}
