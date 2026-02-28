import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
// import { SignupDTO } from 'src/auth/authDTO/signup.dto';
import z from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly shcema: z.ZodObject) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    const result = await this.shcema.safeParseAsync(value);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }
    return result;
  }
}
