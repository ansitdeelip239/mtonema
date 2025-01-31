export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  storeUser: (user: User) => void;
  storeToken: (token: string) => void;
  authToken: string | null;
  dataUpdated: boolean;
  setDataUpdated: (value: boolean) => void;
  navigateToPostProperty: boolean;
  setNavigateToPostProperty: (value: boolean) => void;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  httpStatus: number;
}

export interface User {
  ID: number;
  Name: string;
  Email: string;
  Password: string;
  Location: string;
  Phone: string;
  Role: string;
  Token: string;
  CreatedOn: Date | null;
  UpdatedOn: Date | null;
  CreatedBy: string | null;
  UpdatedBy: string | null;
  Status: number;
  varificationlink: string | null;
  LogoPath: string;
  ColorTheme: string;
  PropertyListed: number;
  sellerStatus: string | null;
}

export interface Response<T> {
  Success: boolean;
  Message: string;
  data: T;
  httpStatus: number;
  predictions?: any;
}
export interface PropertyModel {
  ID: number;
  UserId: number;
  ImageURL: {
    ImageUrl: string;
    Type: number;
    toggle: boolean;
  }[];
  ImageURLType: any | null;
  Image: any | null;
  Tags: any[];
  Tag: any | null;
  VideoURL: string | null;
  VideoUrl: any | null;
  Video: any | null;
  Location: string;
  Price: number;
  Discription: string;
  ShortDiscription: string | null;
  SellerType: {
    MasterDetailName: string;
    ID: number;
  };
  Country: any | null;
  State: any | null;
  PropertyType: {
    MasterDetailName: string;
    ID: number;
  };
  PropertyFor: {
    MasterDetailName: string;
    ID: number;
  };
  CreatedOn: string;
  UpdatedOn: string;
  CreatedBy: string;
  UpdatedBy: string;
  Status: number;
  BhkType: any | null;
  Furnishing: any | null;
  Locality: string;
  ZipCode: string;
  Area: number;
  IsFeatured: boolean;
  floor: any | null;
  readyToMove: any | null;
  SellerName: string;
  SellerEmail: string;
  SellerPhone: string;
  ApprovedBy: string;
  City: {
    MasterDetailName: string;
    ID: number;
  };
  Size: {
    MasterDetailName: string;
    ID: number;
  };
  Rate: {
    MasterDetailName: string;
    ID: number;
  };
  otherCity: any | null;
  Facing: {
    MasterDetailName: string;
    ID: number;
  };
  OpenSide: string;
  BoundaryWall: string;
  ConstructionDone: string;
  Parking: any | null;
  Lifts: any | null;
  PropertyForType: string;
  PropertyAge: any | null;
  AlarmSystem: any | null;
  SurveillanceCameras: any | null;
  GatedSecurity: any | null;
  CeilingHeight: any | null;
  Pantry: any | null;
  ListedBy: string;
  PropertyLocation?: string;
  propertyModels?: any[];
}
// export interface SignUpRequest {
//   Name: string;
//   Email: string;
//   Location: string;
//   Phone: string;
//   URL: string;
//   Password: string;
//   TermsChecked: true;
// }
export interface SignUpRequest {
  Name: string;
  Email: string;
  Location: string;
  Phone: string;
  Password?: string;
  TermsChecked?: boolean;
  URL?: string;
}

export interface MasterDetailModel {
  MasterDetailName: string;
  ID: number;
}

export interface AgentData {
  Id: number;
  AgentContactNo: string;
  AgentName: string;
  DemandPrice: string;
  PropertyLocation: string;
  PropertyNotes: string;
  SecurityDepositAmount: string;
  Negotiable: boolean;
  CreatedOn: string;
  FlatSize: MasterDetailModel;
}

export interface PagingModel {
  CurrentPage: number;
  NextPage: boolean;
  PageSize: number;
  TotalCount: number;
  TotalPage: number;
  PreviousPage: boolean;
}

export interface FilterValues {
  propertyLocation: string | null;
  propertyType: string | null;
  bhkType: string | null;
}

export interface AgentPropertyRequestModel {
  AgentName: string;
  AgentContactNo: string;
  PropertyLocation: string;
  PropertyType: string;
  FlatSize: string;
  DemandPrice: string;
  SecurityDepositAmount: string;
  Negotiable: boolean;
  PropertyNotes: string;
  Status: number;
  Id: number;
  PriceUnit: string | null;
  EmailId: string;
}

export interface MasterDataModel {
  ID: number;
  Name: string;
}

export interface ClientActivityDataModel {
  Id: number;
  ActivityType: MasterDataModel;
  AssignedTo: MasterDataModel;
  Description: string;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface Group {
  Id: number;
  GroupName: string;
  GroupColor: string;
  Color: MasterDataModel;
  PartnerId: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface Client {
  Id: number;
  PartnerId: number;
  ClientName: string;
  DisplayName: string;
  MobileNumber: string;
  WhatsappNumber: string;
  EmailId: string;
  Notes: string;
  ClientActivityDataModels: ClientActivityDataModel[];
  Groups: {ID: number; Name: string; GroupColor: string}[];
  CreatedOn: string;
  Activity: string;
  Status: number;
}

export interface ClientResponseModel {
  responsePagingModel: PagingModel;
  clientDataModel: Client[];
}

export interface ClientForm {
  ClientName: string;
  DisplayName?: string;
  MobileNumber?: string;
  WhatsappNumber?: string;
  EmailId?: string;
  Notes?: string;
  Groups?: number[];
  PartnerId: string;
}

export interface SearchIntellisenseResponse {
  AgentName: string | null;
  AgentContactNo: string | null;
  Location: string | null;
}
