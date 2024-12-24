export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) =>void;
    logout: () => void;
    storeUser: (user:User) => void;
    storeToken: (token:string) => void
    authToken: string | null;
    dataUpdated: boolean;
    setDataUpdated: (value: boolean) => void;  
  }
  export interface User {
    ID: number;
    Name: string;
    Email: string;
    Password: string;
    Location: string;
    Phone: string;
    Role: string;
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
    Message: string;
    Success: boolean;
    data: T;
    httpStatus : number;
}
  
