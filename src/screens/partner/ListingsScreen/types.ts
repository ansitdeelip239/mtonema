export interface PropertiesResponse {
  pagination: PaginationData;
  properties: Property[];
}

export interface PaginationData {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Property {
  id: number;
  userId: number;
  sellerName: string | null;
  sellerEmail: string | null;
  sellerType: string | null;
  location: string | null;
  city: string | null;
  zipCode: string | null;
  propertyName: string | null;
  price: number | null;
  propertyFor: string | null;
  propertyType: string | null;
  imageURL: string | null;
  videoURL: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  createdOn: string | null;
  updatedOn: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  propertyDetailId: number | null;
  approvedBy: string | null;
  readyToMove: boolean | null;
  bhkType: string | null;
  propertyForType: string | null;
  area: number | null;
  furnishing: string | null;
  featured: boolean | null;
  floor: string | null;
  lmUnit: string | null;
  openSide: string | null;
  facing: string | null;
  boundaryWall: boolean | null;
  constructionDone: boolean | null;
  parking: string | null;
  lifts: boolean | null;
  propertyAge: string | null;
  alarmSystem: boolean | null;
  surveillanceCameras: boolean | null;
  gatedSecurity: boolean | null;
  ceilingHeight: string | null;
  pantry: boolean | null;
  tags: string | null;
  recordstatus: string | null;
}

export const parseTags = (tagsString: string): string[] => {
  try {
    return JSON.parse(tagsString);
  } catch (error) {
    console.error('Error parsing tags:', error);
    return [];
  }
};

export interface FilterValues {
  propertyFor: string | null;
  status: string | null;
  city: string | null;
}
