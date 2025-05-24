import {createContext} from 'react';
import {AuthContextType, MasterDetailModel, User} from '../types';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  login: (_token: string) => {},
  logout: () => {},
  storeUser: (_user: User) => {},
  storePartnerZone: (_partnerZone: MasterDetailModel) => {},
  storeToken: (_token: string) => {},
  authToken: null,
  dataUpdated: false,
  setDataUpdated: () => {},
  setNavigateToPostProperty: () => {},
  navigateToPostProperty: false,
  isLoading: false,
});
export default AuthContext;
