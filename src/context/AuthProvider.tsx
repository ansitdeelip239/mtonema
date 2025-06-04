import React, {useState, useEffect, useCallback, useRef} from 'react';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import AuthContext from './AuthContext';
import {MasterDetailModel, User} from '../types';
import {useLogoStorage} from '../hooks/useLogoStorage';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [navigateToPostProperty, setNavigateToPostProperty] = useState(false);
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  const {clearLogoData} = useLogoStorage();

  // Use useRef for timer to prevent memory leaks
  const tokenExpiryTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const logout = useCallback(async () => {
    try {
      await AuthService.removeUserData();
      await AsyncStorage.removeItem('tokenExpiry');
      await AsyncStorage.removeItem('token');
      await clearLogoData();
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);
      // Clear token expiry timer
      if (tokenExpiryTimer.current) {
        clearTimeout(tokenExpiryTimer.current);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still reset state even if storage clear fails
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);
    }
  }, [clearLogoData]);

  const handleTokenExpiry = useCallback(
    (token: string) => {
      if (!token) {
        console.error('Invalid token provided');
        logout();
        return;
      }

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        // Validate token structure
        if (!decodedToken || typeof decodedToken.exp !== 'number') {
          console.error('Invalid token structure');
          logout();
          return;
        }

        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        // const timeUntilExpiry = 70000;   //this is for testing time its workign or not
        console.log('Expiry time token:', expiryTime);
        console.log('Time until expiry:', timeUntilExpiry);

        // Check if token is already expired
        if (timeUntilExpiry <= 0) {
          console.warn('Token has already expired');
          logout();
          return;
        }

        // Clear any existing timer
        if (tokenExpiryTimer.current) {
          clearTimeout(tokenExpiryTimer.current);
        }

        // Set buffer time (1 minute) before expiry to ensure smooth logout
        const bufferTime = 1 * 60 * 1000; // 1 minute in milliseconds
        const timerDuration = Math.max(0, timeUntilExpiry - bufferTime);

        // Set new timer with buffer time
        tokenExpiryTimer.current = setTimeout(() => {
          console.log('Token expiring soon, logging out');
          logout();
        }, timerDuration);
      } catch (error) {
        console.error(
          'Token decode failed:',
          (error as any)?.message || 'Unexpected error during token handling',
        );
        logout();
      }
    },
    [logout],
  );

  const storeUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw error;
    }
  }, []);

  const storeToken = useCallback(async (token: string) => {
    try {
      setAuthToken(token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }, []);

  const storePartnerZone = useCallback(async (partnerZone: MasterDetailModel) => {
    try {
      await AsyncStorage.setItem('partnerZone', JSON.stringify(partnerZone));
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }, []);

  const login = useCallback(
    async (token: string) => {
      try {
        console.log('************', token);
        await AuthService.storeUserData(token);
        setAuthToken(token);
        setIsAuthenticated(true);
        handleTokenExpiry(token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [handleTokenExpiry],
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);

          const expiryTime = decodedToken.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expiryTime) {
            console.log('Token expired during app closure, logging out');
            await logout();
          } else {
            const userData = await AuthService.getUserData();
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
              setAuthToken(token);
              handleTokenExpiry(token);
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        await logout();
      } finally {
        // Set loading to false when authentication check is complete
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    return () => {
      if (tokenExpiryTimer.current) {
        clearTimeout(tokenExpiryTimer.current);
      }
    };
  }, [handleTokenExpiry, logout]);

  const contextValue = {
    isAuthenticated,
    user,
    setUser,
    login,
    logout,
    storeUser,
    storeToken,
    storePartnerZone,
    authToken,
    dataUpdated,
    setDataUpdated,
    setNavigateToPostProperty,
    navigateToPostProperty,
    isLoading, // Expose the loading state
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
