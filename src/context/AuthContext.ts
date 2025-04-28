import {createContext} from 'react';
import {AuthContextType, User} from '../types';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  login: (_token: string) => {},
  logout: () => {},
  storeUser: (_user: User) => {},
  storeToken: (_token: string) => {},
  authToken: null,
  dataUpdated: false,
  setDataUpdated: () => {},
  setNavigateToPostProperty: () => {},
  navigateToPostProperty: false,
  isLoading: false,
});
export default AuthContext;
