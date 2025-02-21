import {z} from 'zod';

export const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export type EmailFormData = z.infer<typeof emailSchema>;
