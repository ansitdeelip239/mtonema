import {Response, User} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';

class AuthService {
  static async verifyLoginInput(
    loginInput?: string,
  ): Promise<Response<User | null>> {
    try {
      if (!loginInput) {
        throw new Error('Email or phone number is required');
      }

      const response = await fetch(api.ValidateEmail +loginInput, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });

      const result: Response<User | null> = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(
          result.Message ||
            'An error occurred while validating the login input',
        );
      }
    } catch (error) {
      return {
        Message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        Success: false,
        data: null,
        httpStatus: 500,
      };
    }
  }

static async verifyPassword(
  email: string,
    password: string,
  ): Promise<Response<string>> {
    try {
      
      const response = await fetch(api.Login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({email,password})
    });

      const result: Response<string> = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(
          result.Message ||
            'An error occurred while validating the password',
        );
      }
    } catch (error) {
      return {
        Message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        Success: false,
        data: 'invalid password',
        httpStatus: 500,
      };
    }
  }
  // Store user data
  static async storeUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
      console.error('Error storing user data', error);
    }
  }

  // Retrieve user data
  static async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data', error);
      return null;
    }
  }

  // Remove user data on logout
  static async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data', error);
    }
  }
}

export default AuthService;
