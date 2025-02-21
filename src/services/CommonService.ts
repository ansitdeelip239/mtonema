import url from '../constants/api';
import {User} from '../types';
import {api} from '../utils/api';

class CommonService {
  public static async updateProfile(requestBody: User) {
    try {
      const response = api.put<User>(`${url.users}`, requestBody);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default CommonService;
