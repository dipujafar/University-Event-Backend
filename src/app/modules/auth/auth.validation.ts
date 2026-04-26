import { z } from 'zod';

export const loginZodValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid email format!'),
  }),
});
export const loginAdminZodValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid email format!'),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

export const changePasswordZodValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required!' }),
    newPassword: z.string({ required_error: 'New password is required!' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required!',
    }),
  }),
});

export const forgotPasswordZodValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid email format!'),
  }),
});

export const resetPasswordZodValidationSchema = z.object({
  body: z.object({
    newPassword: z.string({ required_error: 'New password is required!' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required!',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const authValidation = {
  refreshTokenValidationSchema,
  loginAdminZodValidationSchema,
  loginZodValidationSchema,
  changePasswordZodValidationSchema,
  forgotPasswordZodValidationSchema,
  resetPasswordZodValidationSchema,
};
