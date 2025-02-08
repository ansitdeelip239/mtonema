import {Response, SignUpRequest, User} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';
import {SignupBody} from '../schema/SignUpFormSchema';
import {api as Api} from '../utils/api';

class AuthService {
  static async verifyLoginInput(
    loginInput?: string,
  ): Promise<Response<User | null>> {
    try {
      if (!loginInput) {
        throw new Error('Email is required');
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
  static async signUp(body: SignUpRequest) {
    try {
      const response = await fetch(api.UserSignUp, {
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
      console.log('jjhsljhvsbjlbdsljhbds', body);
      const response = await fetch(api.UserSignUp, {
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

  static async OtpVerification(Email: string, OTP?: string) {
    try {
      const requestBody = OTP ? {Email, OTP} : {Email};
      const response = await Api.post<string | null>(
        api.OtpVerification,
        requestBody,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async GetUserByToken(token: string) {
    try {
      const response = await Api.get<User>(api.GetUserByToken + token);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async RegisterSeller(
    formData: SignUpRequest,
  ): Promise<Response<string>> {
    try {
      const response = await fetch(api.RegisterSeller, {
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
        throw new Error(result.Message || 'An Error Ocured While signup');
      }
    } catch (error) {
      throw error;
    }
  }

  static async VerifyOTP(
    Email: string,
    OTP: string,
  ): Promise<Response<string>> {
    try {
      const response = await fetch(api.VerifyOTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Email, OTP}),
      });

      const result: Response<string> = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(
          result.Message || 'An error occurred while validating the Register',
        );
      }
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
      throw new Error('Failed to verify password');
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
