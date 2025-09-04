export interface PropertyForTypes {
  RENT: 'Rent';
  SALE: 'Sale';
  OTHERS: 'Others';
}

export const PropertyFor: PropertyForTypes = {
  RENT: 'Rent',
  SALE: 'Sale',
  OTHERS: 'Others',
} as const;
