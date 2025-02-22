import {z} from 'zod';

const clientFormSchema = z.object({
  id: z.number().optional(),
  clientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .nonempty('Client Name is required'),
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces')
    .optional(),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .optional(),
  whatsappNumber: z
    .string()
    .regex(/^\d{10}$/, 'WhatsApp number must be exactly 10 digits')
    .optional(),
  emailId: z.string().email('Invalid email address').optional(),
  notes: z.string().optional().default(''),
  groups: z.array(z.number()).optional().default([]),
  partnerId: z.string().nonempty('Partner ID is required'),
});

export default clientFormSchema;
