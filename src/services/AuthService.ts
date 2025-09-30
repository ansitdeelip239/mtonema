import {PlacesResponse, Response, User} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../constants/api';
import {SignupBody, SignupFormType} from '../schema/SignUpFormSchema';
import {api} from '../utils/api';
import {RoleTypes} from '../constants/Roles';
import {
  PartnerSignupBody,
  PartnerSignupFormType,
} from '../schema/PartnerSignUpFormSchema';

interface GetInTouchResponse {
  id: number;
  enquiryType: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  recordStatus: number;
}

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
        `${url.auth.validateEmail}?email=${email}`,
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
        url.auth.userSignup,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async partnerSignUp(
    body: PartnerSignupBody,
  ): Promise<Response<PartnerSignupFormType | null>> {
    try {
      const response = await api.post<PartnerSignupFormType | null>(
        url.auth.partnerSignup,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getInTouch(body: {
    subject: string;
    message: string;
    email: string;
    name: string;
    phone: string;
    domain: string;
  }): Promise<Response<GetInTouchResponse>> {
    try {
      const response = await api.post<GetInTouchResponse>(
        url.seller.getInTouch,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async otpVerification(email: string, otp?: string, domain?: string) {
    try {
      let requestBody: any = {email};

      if (otp) {
        requestBody.otp = otp;
      }

      if (domain) {
        requestBody.domain = domain;
      }

      const response = await api.post<string | null>(
        url.auth.otpVerification,
        requestBody,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByToken(token: string) {
    try {
      const response = await api.get<User>(`${url.users.list}?token=${token}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId: number) {
    try {
      const response = await api.delete<void>(`${url.users.delete}/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getPlaces(text: string, city: string) {
    try {
      const response = await api.get<PlacesResponse>(
        `${url.masterDetails.getPlaces}?text=${text}&city=${city}`,
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
