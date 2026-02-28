import { IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  otp!: string;

  @IsString()
  userId!: string;

  @IsString()
  type!: string;
}
