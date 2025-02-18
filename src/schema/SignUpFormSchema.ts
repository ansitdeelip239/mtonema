import {z} from 'zod';
import Roles, {RoleTypes} from '../constants/Roles';

// Define the allowed roles
const UserRoleEnum = z.enum([Roles.BUYER, Roles.SELLER]);

const SignUpFormSchema = z.object({
  Name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Name is required'),
  Email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  Location: z.string().nonempty('Location is required'),
  Phone: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .nonempty('Mobile Number is required'),
});

// Define the complete schema including Role
const CompleteSignupSchema = SignUpFormSchema.extend({
  Role: UserRoleEnum,
});

// Modified apiSubmissionSchema
const apiSubmissionSchema = (role: RoleTypes['BUYER'] | RoleTypes['SELLER']) =>
  SignUpFormSchema.transform(data => ({
    ...data,
    Role: role,
  }));

// Update type definitions
export type SignupFormType = z.infer<typeof SignUpFormSchema>;
export type SignupBody = z.infer<typeof CompleteSignupSchema>;

export {apiSubmissionSchema};
export default SignUpFormSchema;
