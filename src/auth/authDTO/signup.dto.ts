import {
  IsEmail,
  IsInt,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

export class SignupDTO {
  @IsEmail()
  email?: string;

  // @IsStrongPassword({
  //   minLength: 8,
  //   minSymbols: 1,
  //   minLowercase: 2,
  // })
  @IsStrongPassword()
  password?: string;

  // @IsStrongPassword({
  //   minLength: 8,
  //   minSymbols: 1,
  //   minLowercase: 2,
  // })
  @IsStrongPassword()
  confirmPassword!: string;

  @IsString()
  name?: string;

  @IsInt()
  @Min(18)
  @Max(60)
  age?: number;
}
