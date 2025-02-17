import url from '../constants/api';
import {ContactedPropertyResponse, UserData, VisitorRequest, VisitorResponse} from '../types/admin';
import {api} from '../utils/api';

class AdminService {
  static async getAllUser(pageNumber: number, pageSize: number) {
    try {
      const response = await api.get<UserData>(
        `${url.getAllUsers}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error('Error in GetAllUser: ', error);
      throw error;
    }
  }

  static async getVisitors(body: VisitorRequest) {
    try {
      const response = await api.post<VisitorResponse>(
        `${url.getVisitor}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in getVisitors: ', error);
      throw error;
    }
  }

  static async getAllContactedProperty(pageNumber: number, pageSize: number) {
    try {
      const response = await api.get<ContactedPropertyResponse>(
        `${url.getAllContact}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getAllContact: ', error);
      throw error;
    }
  }
}

export default AdminService;
