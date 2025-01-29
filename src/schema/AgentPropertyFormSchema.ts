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

  propertyType: z
    .string()
    .refine(
      val => val === '' || val.length > 0,
      'Property type must not be empty if provided',
    )
    .optional()
    .default(''),

  bhkType: z
    .string()
    .refine(
      val => val === '' || val.length > 0,
      'BHK type must not be empty if provided',
    )
    .optional()
    .default(''),

  demandPrice: z
    .string()
    .refine(
      val =>
        val === '' || (/^[1-9]\d*$/.test(val) && parseInt(val, 10) >= 1000),
      'If provided, price must be at least 1000',
    )
    .optional()
    .default(''),

  securityDepositAmount: z
    .string()
    .refine(
      val => val === '' || (/^[1-9]\d*$/.test(val) && parseInt(val, 10) >= 100),
      'If provided, security deposit must be at least 100',
    )
    .optional()
    .default(''),

  negotiable: z.boolean().default(false),

  propertyNotes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .default(''),
});

const apiSubmissionSchema = agentPropertyFormSchema.transform(data => ({
  ...data,
  demandPrice: data.demandPrice ? parseInt(data.demandPrice, 10) : 0,
  securityDepositAmount: data.securityDepositAmount
    ? parseInt(data.securityDepositAmount, 10)
    : 0,
}));

export type AgentPropertyFormType = z.infer<typeof agentPropertyFormSchema>;
export type ApiSubmissionType = z.infer<typeof apiSubmissionSchema>;
export {apiSubmissionSchema};
export default agentPropertyFormSchema;
