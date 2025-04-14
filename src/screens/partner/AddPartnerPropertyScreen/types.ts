export type PropertyFormData = {
  // Basic details
  propertyTitle: string;
  propertyType: string;
  propertyLocation: string;

  // Property details
  bedrooms: string;
  bathrooms: string;
  area: string;
  price: string;

  // Media & additional info
  description: string;
  images: string[];
  amenities: string[];
};
