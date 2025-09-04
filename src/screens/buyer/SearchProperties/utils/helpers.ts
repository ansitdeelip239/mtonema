// Utility functions for SearchPropertiesScreen
import { PropertyFor } from '../../../../constants/MasterDetails';

export const formatPrice = (price: number, propertyFor: typeof PropertyFor.SALE | typeof PropertyFor.RENT | typeof PropertyFor.OTHERS) => {
  if (propertyFor === PropertyFor.SALE) {
    if (price >= 10000000) { // 1 crore
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) { // 1 lakh
      return `₹${(price / 100000).toFixed(1)} L`;
    }
  } else if (propertyFor === PropertyFor.RENT) {
    return `₹${price.toLocaleString()}/month`;
  } else if (propertyFor === PropertyFor.OTHERS) {
    // For others, show price as is
    return `₹${price.toLocaleString()}`;
  }
  return `₹${price.toLocaleString()}`;
};

export const parseImageUrl = (imageURL: string) => {
  try {
    const images = JSON.parse(imageURL);
    if (Array.isArray(images) && images.length > 0) {
      return images[0].imageUrl;
    }
  } catch (e) {
    // Fallback if parsing fails
  }
  return '';
};
