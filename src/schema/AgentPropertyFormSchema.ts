import {z} from 'zod';

const agentPropertyFormSchema = z.object({
  agentName: z
    .string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(100, 'Agent name is too long')
    .regex(/^[a-zA-Z\s]*$/, 'Agent name must contain only letters and spaces')
    .nonempty('Agent name is required'),

  agentContactNo: z
    .string()
    .regex(/^\d{10}$/, 'Contact number must be exactly 10 digits')
    .nonempty('Contact number is required'),

  propertyLocation: z
    .string()
    .min(5, 'Property location must be at least 5 characters')
    .max(200, 'Property location is too long')
    .regex(
      /^[a-zA-Z0-9\s,.-]*$/,
      'Location can only contain letters, numbers, spaces, and basic punctuation',
    )
    .nonempty('Property location is required'),

  propertyType: z.string().nonempty('Property type is required'),

  bhkType: z.string().nonempty('BHK type is required'),

  demandPrice: z
    .string()
    .min(1, 'Demand price is required')
    .regex(
      /^[1-9]\d*$/,
      'Price must be a positive number without leading zeros',
    )
    .refine(val => parseInt(val, 10) >= 1000, 'Price must be at least 1000'),

  securityDepositAmount: z
    .string()
    .min(1, 'Security deposit is required')
    .regex(
      /^[1-9]\d*$/,
      'Security deposit must be a positive number without leading zeros',
    )
    .refine(
      val => parseInt(val, 10) >= 100,
      'Security deposit must be at least 100',
    ),

  negotiable: z.boolean().default(false),

  propertyNotes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .default(''),
});

const apiSubmissionSchema = agentPropertyFormSchema.transform(data => ({
  ...data,
  demandPrice: parseInt(data.demandPrice, 10),
  securityDepositAmount: parseInt(data.securityDepositAmount, 10),
}));

export type AgentPropertyFormType = z.infer<typeof agentPropertyFormSchema>;
export type ApiSubmissionType = z.infer<typeof apiSubmissionSchema>;
export {apiSubmissionSchema};
export default agentPropertyFormSchema;
