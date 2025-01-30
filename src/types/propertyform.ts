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
  ImageURL: {ID: string; [key: string]: any}[];
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
}

//   sellerType: string;
//   city: string;
//   propertyFor: string;
//   propertyType: string;
//   residentialCommercial: string;
//   address: string;
//   zipCode: string;
//   isReadyToMove: string;
//   isLiftAvailable: string;
//   isPantryAvailable: string;
//   furnishedType: string;
//   carParking: string;
//   facing: string;
//   amount: string;
//   amountUnit: string;
//   propertyArea: string;
//   areaUnit: string;
//   description: string;

//   // Form 2 - Property Details
//   bedrooms: string;
//   bathrooms: string;
//   balconies: string;
//   totalFloors: string;
//   floorNumber: string;
//   propertyAge: string;
//   expectedPrice: string;
//   priceUnit: string;

//   // Form 3 - Additional Details
//   amenities: string[];
//   images: string[];
//   videos: string[];
// }
