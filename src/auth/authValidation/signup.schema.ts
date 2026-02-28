import z from 'zod';

export const SignupSchema = z
  .object({
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    name: z.string(),
    age: z.number().positive(),
    gender: z.string(),
  })
  .superRefine((args, ctx) => {
    if (args.password != args.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'password must be equal to confirmPassword',
      });
    }
  });
