export interface PropertyFormData {
  // Form 1 - Basic Details
  AlarmSystem: null | 'Yes' | 'No';
  ApprovedBy: null | string;
  Area: null | number;
  BhkType: null | number;
  BoundaryWall: null | 'Yes' | 'No';
  CeilingHeight: null | string;
  City: null | number;
  ConstructionDone: null | 'Yes' | 'No';
  Country: null | string;
  CreatedBy: null | string;
  Discription: null | string;
  Facing: null | number;
  Furnishing: null | number;
  GatedSecurity: null | 'Yes' | 'No';
  ImageURL: ImageType[];
  ImageURLType: any[];
  IsFeatured: boolean;
  Lifts: null | 'Yes' | 'No';
  Location: null | string;
  OpenSide: null | 'One' | 'Two' | 'Three' | 'Four';
  Pantry: null | 'Yes' | 'No';
  Parking: null | 'Yes-Shaded' | 'Yes-Unshaded' | 'No';
  Price: null | string;
  PropertyAge:
    | null
    | '0-5 Yrs'
    | '5-10 Yrs'
    | '10-15 Yrs'
    | '15-20 Yrs'
    | '20+ Yrs';
  PropertyFor: null | number;
  PropertyForType: 'Residential' | 'Commercial' | null;
  PropertyType: null | number;
  Rate: null | number;
  SellerEmail: null | string;
  SellerName: null | string;
  SellerPhone: null | string;
  SellerType: null | number;
  ShortDiscription: null | string;
  Size: null | string;
  State: null | string;
  Status: null | string;
  SurveillanceCameras: null | 'Yes' | 'No';
  Tag: null | string;
  Tags: any[];
  UserId: null | string;
  VideoURL: null | string;
  ZipCode: null | string;
  floor: null | string;
  locality: null | string;
  otherCity: null | string;
  readyToMove: null | 'Yes' | 'No';
  statusText: null | string;
  video: null | string;
  propertyClassification: null | string;
  CarParking: null | string;
  ID?: string;
}

export interface ImageType {
  ID: string;
  imageNumber: number;
  ImageUrl: string;
  isselected: boolean;
  toggle: boolean;
  Type: number;
}


export const initialFormData: PropertyFormData = {
  AlarmSystem: null,
  ApprovedBy: null,
  Area: null,
  BhkType: null,
  BoundaryWall: null,
  CeilingHeight: null,
  City: null,
  ConstructionDone: null,
  Country: null,
  CreatedBy: null,
  Discription: null,
  Facing: null,
  Furnishing: null,
  GatedSecurity: null,
  ImageURL: [],
  ImageURLType: [],
  IsFeatured: false,
  Lifts: null,
  Location: null,
  OpenSide: null,
  Pantry: null,
  Parking: null,
  Price: null,
  PropertyAge: null,
  PropertyFor: null,
  PropertyForType: null,
  PropertyType: null,
  Rate: null,
  SellerType: null,
  ShortDiscription: null,
  Size: null,
  State: null,
  Status: null,
  SellerEmail:null,
  SellerName:null,
  SellerPhone:null,
  UserId:null,
  SurveillanceCameras: null,
  Tag: null,
  Tags: [],
  VideoURL: null,
  ZipCode: null,
  CarParking: null,
  floor: null,
  locality: null,
  otherCity: null,
  readyToMove: null,
  statusText: null,
  video: null,
  propertyClassification: null,
};
