import {PlacesResponse, Response, User} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../constants/api';
import {SignupBody, SignupFormType} from '../schema/SignUpFormSchema';
import {api} from '../utils/api';
import {RoleTypes} from '../constants/Roles';

interface ValidateEmailResponse {
  id: number;
  email: string;
  userType: RoleTypes[keyof RoleTypes];
}

class AuthService {
  static async verifyLoginInput(
    email?: string,
  ): Promise<Response<ValidateEmailResponse | null>> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await api.get<ValidateEmailResponse | null>(
        `${url.ValidateEmail}?email=${email}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async userSignUp(
    body: SignupBody,
  ): Promise<Response<SignupFormType | null>> {
    try {
      const response = await api.post<SignupFormType | null>(
        url.userSignup,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async otpVerification(email: string, otp?: string) {
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

  static async getUserByToken(token: string) {
    try {
      const response = await api.get<User>(`${url.users}?token=${token}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getPlaces(text: string, city: string) {
    try {
      const response = await api.get<PlacesResponse>(
        `${url.getPlaces}?text=${text}&city=${city}`,
      );
      return response;
    } catch (error) {
      console.log('Error in getplaces', error);
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
