import {z} from 'zod';
import Roles from '../constants/Roles';

const AllowedRolesEnum = z.enum([Roles.PARTNER]);
type AllowedRoles = z.infer<typeof AllowedRolesEnum>;

const PartnerSignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Name is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  phone: z
    .string()
    .transform(val => val || '')
    .refine(
      (val) => val === '' || /^\d{10}$/.test(val),
      'Mobile number must be exactly 10 digits'
    ),
  partnerZone: z.string().nonempty('Zone is required'),
});

const partnerSignupSubmissionSchema = (role: AllowedRoles, location: string) =>
  PartnerSignUpFormSchema.transform(data => ({
    name: data.name,
    email: data.email,
    phone: data.phone || '', // Ensure phone is always a string
    partnerZone: data.partnerZone,
    role: AllowedRolesEnum.parse(role),
    location,
  }));

// Update type definitions
export type PartnerSignupFormType = z.infer<typeof PartnerSignUpFormSchema>;
export type PartnerSignupBody = PartnerSignupFormType & {role: AllowedRoles};

export {partnerSignupSubmissionSchema};
export default PartnerSignUpFormSchema;
