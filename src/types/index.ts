import { PropertyForTypes, SortByTypes } from '../constants/MasterDetails';
import {ImageType} from './propertyform';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string) => void;
  logout: () => void;
  storeUser: (user: User) => void;
  storePartnerZone: (partnerZone: MasterDetailModel) => void;
  storeToken: (token: string) => void;
  authToken: string | null;
  dataUpdated: boolean;
  setDataUpdated: (value: boolean) => void;
  navigateToPostProperty: boolean;
  setNavigateToPostProperty: (value: boolean) => void;
  isLoading: boolean;
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
  partnerLocation?: number;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  httpStatus: number;
  predictions?: PlacePrediction[];
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
  id: number;
  masterDetailName: string;
  description: string;
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
  propertyType: string | undefined;
  bhkType: string | undefined;
  demandPrice: number | undefined;
  securityDepositAmount: number | undefined;
  negotiable: boolean | undefined;
  propertyNotes: string | undefined;
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
  createdBy: string;
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
  };
  partnerId: number;
  createdOn: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Group2Response {
  groups: Group2[];
  responsePagingModel: PagingModel;
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
  clientActivityDataModels?: ClientActivityDataModel[];
  groups: {id: number; name: string; groupColor: string}[];
  createdOn: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  lastActivityDate: string;
  status: number;
  followUp?: FollowUp;
  assignedTeamIds?: {
    id: number;
    name: string;
    email: string;
  }[];
}

export interface FollowUp {
  id: number;
  date: string;
  status: 'Pending' | 'Completed';
  userId: number;
}

export interface FollowUpResponseModel {
  responsePagingModel: PagingModel;
  followUpDataModel: FollowUpType[];
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
  assignedUsers: {
    id: number;
    name: string;
    email: string;
  }[];
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
  id?: number;
}

export interface SearchIntellisenseResponse {
  agentName: string | null;
  agentContactNo: string | null;
  location: string | null;
}

export interface CustomerTestimonialResponse {
  testimonials: CustomerTestimonial[];
  pagination: PagingModel;
}

export interface CustomerTestimonial {
  id: number;
  userType: string;
  customerName: string;
  feedbackText: string;
  imageURL: string;
  videoURL: string | null;
  createdBy: string;
  createdOn: string;
  updatedBy: string | null;
  updatedOn: string | null;
  recordStatus: string;
}

export interface ContentTemplate {
  id: number;
  userId: number;
  userName: string;
  name: string;
  content: string;
  createdBy: number;
  creatorName: string;
  createdOn: string;
  recordStatus: string;
}

export interface ContentTemplatesData {
  contentTemplates: ContentTemplate[];
  totalCount: number;
  responsePagingModel: PagingModel;
}

export interface TransactionFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  method?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Transaction {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  paidAccountId: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  planId: number;
  planName: string;
  status: string;
  amount: number;
  method: string;
  transactionType: string;
  transactionDate: string;
  paymentDate?: string;
  eventType: string;
  errorCode?: string;
  errorDescription?: string;
  reason?: string;
  razorpayInvoiceId: string;
  createdOn: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalAmount: number;
    successfulAmount: number;
    dateRange: {
      fromDate: string;
      toDate: string;
    };
  };
  filters: {
    availableStatuses: string[];
    availableMethods: string[];
    availablePlans: Array<{id: number; name: string}>;
  };
}

export interface TeamMember {
  teamMemberId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  isActive: boolean;
}

export interface AddTeamMemberResponse {
  teamMember: {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdOn: string;
  };
  partnerDetails: {
    id: number;
    location: {
      id: number;
      locationName: string;
      address: string;
      isNewLocation: boolean;
    };
    partnerZone: {
      id: number;
      name: string;
    };
    website: string;
    teamId: number;
  };
  paymentDetails: {
    orderId: string;
    amount: number;
    keyId: string;
    proratedDetails: {
      amount: number;
      daysRemaining: number;
      totalDays: number;
    };
  };
}

// Property Search API Types
export interface PropertyImage {
  imageUrl: string;
  type: string;
  toggle: boolean;
}

export interface Property {
  propertyId: number;
  userId: number;
  name: string;
  sellerPhone: string;
  sellerEmail: string;
  locationId: number;
  locationAddress: string;
  city: string;
  zipcode: string;
  propertyName: string;
  price: number;
  sellerType: string;
  propertyType: string;
  propertyFor: string;
  imageURL: string; // JSON string containing PropertyImage array
  videoURL: string;
  shortDescription: string;
  longDescription: string;
  recordStatus: string;
  propertyDetailsId: number;
  readyToMove: boolean;
  propertyForType: string;
  area: number;
  lmUnit: string;
  facing: string;
  boundaryWall: boolean;
  constructionDone: boolean;
  parking: string;
  lifts: boolean;
  propertyAge?: string;
  alarmSystem?: boolean;
  surveillanceCameras?: boolean;
  gatedSecurity?: boolean;
  pantry?: boolean;
  sourceWebsite: string;
  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
  bhkType?: string;
  furnishing?: string;
  floor?: number;
  isFeatured?: boolean;
  tags?: string;
}

export interface PropertyPagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  startItemNumber: number;
  endItemNumber: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  navigation: {
    firstPage: number;
    nextPage: number;
    lastPage: number;
  };
}

export interface PropertySearchResponse {
  properties: Property[];
  total: number;
  pagination: PropertyPagination;
}

export interface PropertySearchParams {
  page?: number;
  pageSize?: number;
  propertyFor?: PropertyForTypes[keyof PropertyForTypes];
  location?: string;
  sortBy?: SortByTypes[keyof SortByTypes];
  propertyTypes?: string;
  furnishing?: string;
  minAmount?: number;
  maxAmount?: number;
  bhkType?: string;
  city?: string;
  isFeatured?: boolean;
  readyToMove?: boolean;
  searchFilter?: string;
  status?: string;
  sourceWebsite?: string;
}
