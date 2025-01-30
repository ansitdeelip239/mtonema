import {PropertyFormData} from '../types/propertyform';
import url from '../constants/api';
import {api} from '../utils/api';

class SellerService {
  static async addProperty(body: PropertyFormData) {
    try {
      const response = await api.post<null>(`${url.AddProperty}`, body);
      return response;
    } catch (error) {
      console.error('Error in addProperty', error);
      throw error;
    }
  }
}

export default SellerService;
