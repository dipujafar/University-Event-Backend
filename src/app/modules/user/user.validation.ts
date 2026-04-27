import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const guestValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    phoneNumber: z.string().optional(),
    role: z.enum([...Role] as [string, ...string[]]).default(USER_ROLE.user),
    seat: z.string({ required_error: 'Seat is required' }),
    section: z.string().optional(),
    profile: z.string().optional(),
  }),
});

const userRegisterValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    section: z.string({ required_error: 'Section is required' }),
    profile: z.string().optional(),
  }),
});
const userQrCodeSCanValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
  }),
});

export const userValidation = {
  guestValidationSchema,
  userRegisterValidationSchema,
  userQrCodeSCanValidationSchema,
};
