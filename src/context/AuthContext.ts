import {createContext} from 'react';
import {AuthContextType, User} from '../types';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  storeUser: (user:User) => {},
  storeToken: (token:string) => {},
  authToken: null,
  dataUpdated: false,
  setDataUpdated: () => {},
});
export default AuthContext;

