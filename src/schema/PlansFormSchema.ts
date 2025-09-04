import { z } from 'zod';

const PlansFormSchema = z.object({
  planName: z.string().min(2, 'Plan name is required'),
  description: z.string().optional(),
  price: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
    message: 'Price must be a positive number',
  }),
  billingCycle: z.string().min(1, 'Billing cycle is required'),
  durationDays: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
    message: 'Duration must be a positive number',
  }),
  maxUsers: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
    message: 'Max users must be a positive number',
  }),
  isTrial: z.boolean(),
});

export default PlansFormSchema;
