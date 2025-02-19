import {z} from 'zod';
import Roles from '../constants/Roles';

const AllowedRolesEnum = z.enum([Roles.BUYER, Roles.SELLER]);
type AllowedRoles = z.infer<typeof AllowedRolesEnum>;

const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Name is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  location: z.string().nonempty('Location is required'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .nonempty('Mobile Number is required'),
});

const signupSubmissionSchema = (role: AllowedRoles) =>
  SignUpFormSchema.transform(data => ({
    ...data,
    role: AllowedRolesEnum.parse(role),
  }));

// Update type definitions
export type SignupFormType = z.infer<typeof SignUpFormSchema>;
export type SignupBody = SignupFormType & {role: AllowedRoles};

export {signupSubmissionSchema};
export default SignUpFormSchema;
