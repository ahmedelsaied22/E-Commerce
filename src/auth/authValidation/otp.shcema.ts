import z from 'zod';

export const OTPShema = z.object({
  type: z.string(),
  otp: z.string(),
  userId: z.string(),
  expiredAt: z.date(),
});
