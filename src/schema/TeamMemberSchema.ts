import {z} from 'zod';

export const teamMemberSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  phone: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, 'Please enter a valid 10-digit Indian phone number')
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits'),

  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters'),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export const validateTeamMemberForm = (data: TeamMemberFormData) => {
  try {
    teamMemberSchema.parse(data);
    return {success: true, errors: {}};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return {success: false, errors};
    }
    return {success: false, errors: {general: 'Validation failed'}};
  }
};
