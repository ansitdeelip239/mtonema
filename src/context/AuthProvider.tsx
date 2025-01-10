import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './AuthContext';
import { User } from '../types';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  // Use useRef for timer to prevent memory leaks
  const tokenExpiryTimer = useRef<NodeJS.Timeout>();
  const logout = useCallback(async () => {
    try {
      await AuthService.removeUserData();
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
  }, []);
  const handleTokenExpiry = useCallback((token: string) => {
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

      const currentTime = Date.now();
      const expiryTime = decodedToken.exp * 1000;

      const timeUntilExpiry = expiryTime - currentTime;
      // const timeUntilExpiry = 120000;
      // Clear any existing timer
      if (tokenExpiryTimer.current) {
        clearTimeout(tokenExpiryTimer.current);
        tokenExpiryTimer.current = undefined;
      }

      // Check if token is already expired
      if (timeUntilExpiry <= 0) {
        console.warn('Token has already expired');
        logout();
        return;
      }

      // Set buffer time (5 minutes) before expiry to ensure smooth logout
      const bufferTime = 1 * 60 * 1000; // 1 minutes in milliseconds
      const timerDuration = Math.max(0, timeUntilExpiry - bufferTime);
      // Set new timer
      tokenExpiryTimer.current = setTimeout(() => {
        console.log('Token expiring soon, logging out');
        logout();
      }, timerDuration);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Token decode failed:', error.message);
      } else {
        console.error('Unexpected error during token handling');
      }
      logout();
    }
  }, [logout]);
    const storeUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw error;
    }
  }, []);

  const storeToken = useCallback((token: string) => {
    setAuthToken(token);
  }, []);



  const login = useCallback(async (token: string) => {
    try {
      await AuthService.storeUserData(token);
      setAuthToken(token);
      setIsAuthenticated(true);
      handleTokenExpiry(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [handleTokenExpiry]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = await AuthService.getUserData();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          if (authToken) {
            handleTokenExpiry(authToken);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Reset state on error
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
    // Cleanup function to clear timer on unmount
    return () => {
      if (tokenExpiryTimer.current) {
        clearTimeout(tokenExpiryTimer.current);
      }
    };
  }, [authToken, handleTokenExpiry]);

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    storeUser,
    storeToken,
    authToken,
    dataUpdated,
    setDataUpdated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
