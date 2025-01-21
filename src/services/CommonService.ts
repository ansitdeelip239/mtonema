import url1 from '../constants/api';
import {api} from '../utils/api';

class CommonService {
  static async getUserByToken(token: string) {
    try {
      const response = await api.get<any>(url1.GetUserByToken + token);
      return response;
    } catch (error) {
      console.error('Error in GetUserByToken ', error);
      throw error;
    }
  }
}
export default CommonService;
