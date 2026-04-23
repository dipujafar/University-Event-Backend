import { z } from 'zod';

const locationSchema = z.object({
  venue: z.string({ required_error: 'Event venue is required' }),
  address: z.string({ required_error: 'Event address is required' }),
  mapLink: z.string().optional(),
});

const includedSchema = z.object({
  title: z.string({ required_error: 'Included title is required' }),
  image: z.string().optional(),
});

const createEventZodSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: 'Event name is required' }),

      location: locationSchema,

      date: z.coerce.date({
        required_error: 'Event date is required',
      }),

      startTime: z.coerce.date({
        required_error: 'Event start time is required',
      }),

      endTime: z.coerce.date({
        required_error: 'Event end time is required',
      }),

      instructions: z.array(z.string()).optional(),

      included: z.array(includedSchema).optional(),

      isDeleted: z.boolean().optional(),
    })
    .refine(data => data.endTime > data.startTime, {
      message: 'End time must be after start time',
      path: ['endTime'],
    }),
});

const updateEventZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),

      location: locationSchema.partial().optional(),

      date: z.coerce.date().optional(),

      startTime: z.coerce.date().optional(),

      endTime: z.coerce.date().optional(),

      instructions: z.array(z.string()).optional(),

      included: z.array(includedSchema).optional(),

      isDeleted: z.boolean().optional(),
    })
    .refine(
      data => {
        if (data.startTime && data.endTime) {
          return data.endTime > data.startTime;
        }
        return true;
      },
      {
        message: 'End time must be after start time',
        path: ['endTime'],
      },
    ),
});

export const eventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};
