import {Response, SignUpRequest, User} from '../types';
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

      const response = await fetch(api.ValidateEmail + loginInput, {
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
      throw error;
    }
  }
static async signUp(body:SignUpRequest)
{
  try {
    const response = await fetch(api.SignUp,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(body),
    });
    return response.json();
  } catch (error) {
    throw error;
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
        body: JSON.stringify({email, password}),
      });

      const result: Response<string> = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(
          result.Message || 'An error occurred while validating the password',
        );
      }
    } catch (error) {
      throw error;
    }
  }
  // Store user data
  static async storeUserData(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('token',token);
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
