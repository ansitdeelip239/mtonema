import {Response, SignUpRequest, User} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../constants/api';
import {SignupBody} from '../schema/SignUpFormSchema';
import { api } from '../utils/api';

class AuthService {
  static async verifyLoginInput(
    loginInput?: string,
  ): Promise<Response<User | null>> {
    try {
      if (!loginInput) {
        throw new Error('Email is required');
      }

      const response = await fetch(url.ValidateEmail + loginInput, {
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
          result.message ||
            'An error occurred while validating the login input',
        );
      }
    } catch (error) {
      throw error;
    }
  }
  static async signUp(body: SignUpRequest) {
    try {
      const response = await fetch(url.userSignup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async UserSignUp(body: SignupBody) {
    try {
      const response = await fetch(url.userSignup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async OtpVerification(email: string, otp?: string) {
    try {
      const requestBody = otp ? {email, otp} : {email};
      const response = await api.post<string | null>(
        url.otpVerification,
        requestBody,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async GetUserByToken(token: string) {
    try {
      const response = await api.get<User>(`${url.users}?token=${token}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async RegisterSeller(
    formData: SignUpRequest,
  ): Promise<Response<string>> {
    try {
      const response = await fetch(url.RegisterSeller, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result: Response<string> = await response.json();
      if (response.ok) {
        return result;
      } else {
        throw new Error(result.message || 'An Error Ocured While signup');
      }
    } catch (error) {
      throw error;
    }
  }

  // Store user data
  static async storeUserData(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('token', token);
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

  static async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      return token ? token : null;
    } catch (error) {
      console.error('Error retrieving token', error);
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
