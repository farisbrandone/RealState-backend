import { z } from 'zod';

export const propertyFormSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  features: z.object({
    rooms: z.number().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    livingArea: z.object({
      value: z.number().optional(),
      unit: z.string().optional(),
    }),
    // ...
  }),
  listing: z.object({
    type: z.enum(['sale', 'rent']),
    price: z.object({
      amount: z.number(),
      currency: z.string(),
    }),
  }),
});
