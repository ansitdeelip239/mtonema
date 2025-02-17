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
