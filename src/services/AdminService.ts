import url from '../constants/api';
import {api} from '../utils/api';

class AdminService {
  static async getAllUser(pageNumber: number, pageSize: number) {
    try {
      const response = await api.get<any>(`${url.getAllUsers}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response;
    } catch (error) {
      console.error('Error in GetAllUser: ', error);
      throw error;
    }
  }
}

export default AdminService;
