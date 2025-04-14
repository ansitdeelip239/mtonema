import {z} from 'zod';

const partnerPropertyFormSchema = z.object({
  // Seller information
  sellerType: z.string().nullable(),

  // Location details
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100)
    .nullable(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50)
    .nullable(),
  zipCode: z
    .string()
    .or(z.number().int().positive().transform(String))
    .nullable(),

  // Basic property details
  propertyName: z
    .string()
    .min(3, 'Property name must be at least 3 characters')
    .max(100)
    .nullable(),
  price: z
    .number()
    .int()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .nullable(),
  propertyFor: z.string().nullable(),
  propertyType: z.string().nullable(),
  imageURL: z.string().nullable(),
  videoURL: z.string().nullable(),

  // Descriptions
  shortDescription: z
    .string()
    .max(500, 'Short description cannot exceed 500 characters')
    .nullable(),
  longDescription: z
    .string()
    .max(2000, 'Long description cannot exceed 2000 characters')
    .nullable(),

  // Property specifications
  readyToMove: z.boolean().nullable(),
  bhkType: z.string().nullable(),
  propertyForType: z.string().nullable(),
  area: z
    .number()
    .positive()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .nullable(),
  furnishing: z.string().nullable(),
  isFeatured: z.boolean().nullable(),
  floor: z.number().int().or(z.string().transform(Number)).nullable(),
  lmUnit: z.string().nullable(),
  // rate: z.number().or(z.string().transform(Number)).nullable(),
  openSide: z.string().nullable(),
  facing: z.string().nullable(),

  // Property features
  boundaryWall: z.boolean().nullable(),
  constructionDone: z.boolean().nullable(),
  parking: z.string().nullable(),
  lifts: z.boolean().nullable(),
  propertyAge: z.string().nullable(),

  // Security features
  alarmSystem: z.boolean().nullable(),
  surveillanceCameras: z.boolean().nullable(),
  gatedSecurity: z.boolean().nullable(),

  // Additional features
  ceilingHeight: z.string().nullable(),
  pantry: z.boolean().nullable(),

  // Tags
  tags: z
    .string()
    .nullable()
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
    area: typeof data.area === 'string' ? parseInt(data.area, 10) : data.area,
    floor:
      typeof data.floor === 'string' ? parseInt(data.floor, 10) : data.floor,
    // rate: typeof data.rate === 'string' ? parseInt(data.rate, 10) : data.rate,
    // Ensure tags are stringified for API
    tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
  }));

export type PartnerPropertyFormType = z.infer<typeof partnerPropertyFormSchema>;
export type PartnerPropertyApiSubmissionType = z.infer<
  typeof apiSubmissionSchema
>;
export {apiSubmissionSchema};
export default partnerPropertyFormSchema;
