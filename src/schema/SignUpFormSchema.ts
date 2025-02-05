import { z } from 'zod';

const UserRoleEnum = z.enum(['Buyer', 'Seller']);

const SignUpFormSchema = z.object({
  Name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Name is required'),

  Email: z.string().email('Invalid email address')
  .nonempty('Email is required'),

  Location: z.string().nonempty('Property location is required')
  .nonempty('Location is required'),

  Phone: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .nonempty('Mobile Number is required'),
});

const apiSubmissionSchema = SignUpFormSchema.transform(data => ({
  ...data,
  Role: UserRoleEnum.parse('Buyer'),
}));

export type SignupFormType = z.infer<typeof SignUpFormSchema>;
export type SignupBody = z.infer<typeof apiSubmissionSchema>;
export { apiSubmissionSchema };
export default SignUpFormSchema;
