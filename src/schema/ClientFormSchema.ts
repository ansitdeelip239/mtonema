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
    .optional(),
  MobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .optional(),
  WhatsappNumber: z
    .string()
    .regex(/^\d{10}$/, 'WhatsApp number must be exactly 10 digits')
    .optional(),
  EmailId: z.string().email('Invalid email address').optional(),
  Notes: z.string().optional().default(''),
  Groups: z.array(z.number()).optional().default([]),
  PartnerId: z.string().nonempty('Partner ID is required'),
});

export default clientFormSchema;
