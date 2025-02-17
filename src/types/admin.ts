export interface UserModel {
  ID: number;
  Name: string;
  Email: string;
  Location: string;
  Phone: string;
  Role: string;
  CreatedOn: string;
  Status: number;
  PropertyListed: number;
  sellerStatus: {
    MasterDetailName: string;
    ID: number;
  };
}

export interface UserData {
  responsePagingModel: PagingModel;
  userModels: UserModel[];
}

export interface VisitorRequest {
  pageNum: number;
  PageSize: number;
  show: string;
  Address: string;
  date: string;
}

export interface PagingModel {
  CurrentPage: number;
  PageSize: number;
  TotalCount: number;
  TotalPage: number;
  NextPage: boolean;
  PreviousPage: boolean;
}

export interface VisitorDetail {
  Visitor_Ip: string;
  Visitor_Address: string;
  Date_Time: string;
  dates: string;
  Time: string;
  filterByDates: string | null;
}

export interface VisitorResponse {
  responsePagingModel: PagingModel;
  visitorDetailModels: VisitorDetail[];
}

export interface ContactedPropertyModel {
  ID: number;
  UserID: number;
  PropertyID: number;
  SellerID: number;
  CreatedOn: string;
  UpdatedOn: string | null;
  CreatedBy: string | null;
  UpdatedBy: string | null;
  Status: number;
  BuyerName: string;
  BuyerLocation: string;
  SellerName: string;
  SellerLocation: string;
  PropertyLocation: string;
  Subject: string | null;
  Message: string | null;
  Discription: string | null;
  ImageURL: string | null;
  Image: string | null;
  VideoURL: string | null;
  Price: string | null;
  Area: string | null;
  Locality: string | null;
  PropertyType: string | null;
  PropertyFor: string | null;
  Rate: string | null;
  Size: string | null;
  ImageURLType: string | null;
  ShortDiscription: string | null;
  BhkType: string | null;
  Furnishing: string | null;
  SellerType: string | null;
}

export interface ContactedPropertyResponse {
  responsePagingModel: PagingModel;
  contactedPropertyModels: ContactedPropertyModel[];
}
