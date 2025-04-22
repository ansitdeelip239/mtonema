import {z} from 'zod';

// Define required fields for step 1
const requiredStep1Fields = {
  // Basic mandatory fields
  propertyName: z
    .string()
    .min(3, 'Property name must be at least 3 characters')
    .max(100)
    .regex(
      /^[a-zA-Z\s]+$/,
      'Property name can only contain letters and spaces',
    ),
  sellerType: z.string(),
  city: z.string(),
  propertyFor: z.string(),
  propertyType: z.string(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100),
  price: z
    .number()
    .int()
    .positive('Price must be greater than 0')
    .or(z.string().regex(/^\d+$/).transform(Number)),
};

// Define optional fields
const optionalFields = {
  id: z.number().int().positive().optional(),

  // Location details
  zipCode: z
    .string()
    .or(z.number().int().positive().transform(String))
    .nullable()
    .optional(),

  // Basic property details
  imageURL: z.string().nullable().optional(),
  videoURL: z.string().nullable().optional(),

  // Descriptions
  shortDescription: z
    .string()
    .max(500, 'Short description cannot exceed 500 characters')
    .nullable()
    .optional(),
  longDescription: z
    .string()
    .max(2000, 'Long description cannot exceed 2000 characters')
    .nullable()
    .optional(),

  // Property specifications
  readyToMove: z.boolean().nullable().optional(),
  bhkType: z.string().nullable().optional(),
  propertyForType: z.string().nullable().optional(),
  area: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .nullable()
    .optional(),
  furnishing: z.string().nullable().optional(),
  isFeatured: z.boolean().nullable().optional(),
  floor: z
    .number()
    .int()
    .or(z.string().transform(Number))
    .nullable()
    .optional(),
  lmUnit: z.string().nullable().optional(),
  openSide: z.string().nullable().optional(),
  facing: z.string().nullable().optional(),

  // Property features
  boundaryWall: z.boolean().nullable().optional(),
  constructionDone: z.boolean().nullable().optional(),
  parking: z.string().nullable().optional(),
  lifts: z.boolean().nullable().optional(),
  propertyAge: z.string().nullable().optional(),

  // Security features
  alarmSystem: z.boolean().nullable().optional(),
  surveillanceCameras: z.boolean().nullable().optional(),
  gatedSecurity: z.boolean().nullable().optional(),

  // Additional features
  ceilingHeight: z.string().nullable().optional(),
  pantry: z.boolean().nullable().optional(),

  // Tags
  tags: z
    .string()
    .nullable()
    .optional()
    .transform(val => {
      if (!val) {
        return [];
      }
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }),
};

// Combine required and optional fields
const partnerPropertyFormSchema = z.object({
  ...requiredStep1Fields,
  ...optionalFields,
});

// For API submission, include userId and ensure all fields are properly formatted
const apiSubmissionSchema = partnerPropertyFormSchema
  .extend({
    // Add userId for API submission
    userId: z.number().int().positive(),
  })
  .transform(data => ({
    ...data,
    // Convert values to their appropriate types for API submission
    price:
      typeof data.price === 'string' ? parseInt(data.price, 10) : data.price,
    area: data.area
      ? typeof data.area === 'string'
        ? parseInt(data.area, 10)
        : data.area
      : null,
    floor: data.floor
      ? typeof data.floor === 'string'
        ? parseInt(data.floor, 10)
        : data.floor
      : null,
  }));

export type PartnerPropertyFormType = z.infer<typeof partnerPropertyFormSchema>;
export type PartnerPropertyApiSubmissionType = z.infer<
  typeof apiSubmissionSchema
>;
export {apiSubmissionSchema};
export default partnerPropertyFormSchema;
