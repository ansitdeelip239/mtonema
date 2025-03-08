import url from '../constants/api';
import { ProfileFormData } from '../schema/ProfileFormSchema';
import {User} from '../types';
import {api} from '../utils/api';

class CommonService {
  public static async updateProfile(requestBody: ProfileFormData) {
    try {
      const response = api.put<User>(`${url.users}`, requestBody);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default CommonService;
