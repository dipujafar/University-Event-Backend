import { z } from 'zod';
const createAnnouncementsZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
  }),
});

const updateAnnouncementsZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const announcementsValidations = {
  createAnnouncementsZodSchema,
  updateAnnouncementsZodSchema,
};
