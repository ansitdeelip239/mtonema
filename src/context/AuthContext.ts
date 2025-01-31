import {createContext} from 'react';
import {AuthContextType, User} from '../types';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: (_token: string) => {},
  logout: () => {},
  storeUser: (_user: User) => {},
  storeToken: (_token: string) => {},
  authToken: null,
  dataUpdated: false,
  setDataUpdated: () => {},
  setNavigateToPostProperty: () => {},
  navigateToPostProperty: false,
});
export default AuthContext;
