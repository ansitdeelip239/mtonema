import {z} from 'zod';

const clientFormSchema = z.object({
  ClientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Client Name is required'),
  DisplayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Display Name is required'),
  MobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .nonempty('Mobile Number is required'),
  WhatsappNumber: z
    .string()
    .regex(/^\d{10}$/, 'WhatsApp number must be exactly 10 digits')
    .nonempty('WhatsApp Number is required'),
  EmailId: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  Notes: z.string().default(''),
  Groups: z.array(z.number()).min(1, 'Select at least one group'),
  PartnerId: z.string().nonempty('Partner ID is required'),
});

export default clientFormSchema;
