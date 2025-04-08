import {ImageType} from './propertyform';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
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

export interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  phone: string;
  role: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  recordStatus: number;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  httpStatus: number;
  predictions?: any;
}

export interface PropertyModel {
  ID: number;
  UserId: number;
  ImageURL: ImageType[];
  ImageURLType: any | null;
  Image: any | null;
  Tags: any[];
  Tag: any | null;
  VideoURL: string | null;
  VideoUrl: any | null;
  Video: any | null;
  Location: string;
  Price: any;
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

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlacesResponse {
  predictions: PlacePrediction[];
  status: string;
}

export interface MasterDetailModel {
  masterDetailName: string;
  id: number;
}

export interface AgentData {
  id: number;
  agentContactNo: string;
  agentName: string;
  demandPrice: string;
  propertyLocation: string;
  propertyNotes: string;
  propertyType: string;
  securityDepositAmount: string;
  negotiable: boolean;
  bhkType: string;
  createdOn: string;
  createdBy: number;
  modifiedBy: number;
  modifiedOn: string;
  recordStatus: number;
}

export interface PagingModel {
  currentPage: number;
  nextPage: boolean;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  previousPage: boolean;
}

export interface FilterValues {
  propertyLocation: string | null;
  propertyType: string | null;
  bhkType: string | null;
}

export interface AgentPropertyRequestModel {
  partnerid: number;
  agentName: string;
  agentContactNo: string;
  propertyLocation: string;
  propertyType: string;
  bhkType: string;
  demandPrice: string;
  securityDepositAmount: number;
  negotiable: boolean;
  propertyNotes: string;
}

export interface MasterDataModel {
  id: number;
  name: string;
}

export interface ClientActivityDataModel {
  id: number;
  activityType: MasterDataModel;
  assignedTo: MasterDataModel;
  description: string;
  createdOn: string;
  updatedOn: string;
}

export interface GroupResponse {
  groups: Group[];
  pagination: PagingModel;
}
export interface Group {
  id: number;
  groupName: string;
  groupColor: string;
  color: MasterDataModel;
  partnerId: string | null;
  createdOn: string;
  updatedOn: string;
}

export interface Group2 {
  id: number;
  groupName: string;
  color: {
    id: number;
    name: string;
  }
}

export interface Group2Response {
  groups: Group2[];
}

export interface Client {
  id: number;
  partnerId: number;
  clientName: string;
  displayName: string;
  mobileNumber: string;
  whatsappNumber: string;
  emailId: string;
  notes: string;
  clientActivityDataModels: ClientActivityDataModel[];
  groups: {id: number; name: string; groupColor: string}[];
  createdOn: string;
  activity: string;
  status: number;
  followUp?: FollowUp
}

export interface FollowUp {
    id: number;
    date: string;
    status: 'Pending' | 'Completed';
    userId: number;
}

export interface FollowUpType {
  id: number;
  userId: number;
  followUpDate: string;
  status: 'Pending' | 'Completed';
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  client: Client;
}

export interface ClientResponseModel {
  responsePagingModel: PagingModel;
  clientDataModel: Client[];
}

export interface ClientForm {
  clientName: string;
  displayName?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  emailId?: string;
  notes?: string;
  groups?: number[];
  partnerId: string;
}

export interface SearchIntellisenseResponse {
  agentName: string | null;
  agentContactNo: string | null;
  location: string | null;
}
