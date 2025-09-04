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

export interface SortByTypes {
  NEWEST: 'Newest';
  PRICE_LOW_TO_HIGH: 'pricelowtohigh';
  PRICE_HIGH_TO_LOW: 'pricehightolow';
  AREA_LOW_TO_HIGH: 'arealowtohigh';
  AREA_HIGH_TO_LOW: 'areahightolow';
}

export const SortBy: SortByTypes = {
  NEWEST: 'Newest',
  PRICE_LOW_TO_HIGH: 'pricelowtohigh',
  PRICE_HIGH_TO_LOW: 'pricehightolow',
  AREA_LOW_TO_HIGH: 'arealowtohigh',
  AREA_HIGH_TO_LOW: 'areahightolow',
} as const;
