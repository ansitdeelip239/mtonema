import React, {useState, useEffect, useCallback, createContext} from 'react';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import AuthContext from './AuthContext';
import { User } from '../types';


export const AuthProvider = ({children}: any) => {
    
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  // Check auth status on app start
  useEffect(() => 
    {
    const checkAuthStatus = async () => {
      try {
      const storedUser = await AuthService.getUserData();
      if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
        //   setAuthToken(storedUser.auth);
        //   handleTokenExpiry(storedUser.auth);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
      }
    };

    checkAuthStatus();
  }, []);

const storeUser=(user:User) =>{
  setUser(user);
}
const storeToken=(token:string) =>{
  setAuthToken(token);
}



//   const handleTokenExpiry = (token: string) => {
//     try {
//       const decodedToken: any = jwtDecode(token);
//       const expiryTime = decodedToken.exp * 1000 - Date.now();
      
//       if (expiryTime > 0) {
//         setTimeout(() => {
//           logout();
//         }, expiryTime);
//       } else {
//         logout();
//       }
//     } catch (error) {
//       console.error('Failed to decode token', error);
//       logout();
//     }
//   };

  // Login method
  // const login = async (userData: User) => {
  //   try {
  //     // Store user data
  //     await AuthService.storeUserData(userData);
  //     setAuthToken(userData.auth);
  //     setUser(userData);
  //     setIsAuthenticated(true);
  //     handleTokenExpiry(userData.auth);
  //     const fcmToken = (await AsyncStorage.getItem('fcmToken')) || null;
  //     if (fcmToken) {
  //       await AuthService.updateFCMToken(
  //         userData.phoneNumber,
  //         userData.auth,
  //         fcmToken,
  //       );
  //     } else {
  //       console.warn('FCM Token not found');
  //     }
  //   } catch (error) {
  //     console.error('Login failed', error);
  //     throw error;
  //   }
  // };

  // Logout method
//   const logout = useCallback(async () => {
//     try {
//       const storedUser = await AuthService.getUserData();
//       console.log('Clearing FCM');
//       await AuthService.updateFCMToken(
//         storedUser?.phoneNumber ?? '',
//         storedUser?.auth ?? '',
//         '',
//       );
//       console.log('Removing User Data');
//       await AuthService.removeUserData();
//       console.log('Setting User Null');
//       setUser(null);
//       console.log('Setting Auth Token Null');
//       setAuthToken(null);
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error('Logout failed', error);
//     }
//   }, [user]);
function login()  {}
function logout() {}

  // Render loading screen if checking auth status
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        storeUser,
        storeToken,
        authToken,
        dataUpdated,
        setDataUpdated,

      }}>
      {children}
    </AuthContext.Provider>
  );
};
