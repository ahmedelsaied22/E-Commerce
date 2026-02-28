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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = this.JWT.verify(token, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }
}
