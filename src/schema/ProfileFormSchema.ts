import {z} from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(1, 'Location is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const profileApiSchema = profileFormSchema.extend({
  id: z.string(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ProfileApiData = z.infer<typeof profileApiSchema>;
