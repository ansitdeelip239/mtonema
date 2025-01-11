import url1 from '../constants/api';
import {api} from '../utils/api';

class BuyerService {
  static async RecommendedProperty(pageNumber:number,pageSize:number) {
    try {
      const response = await api.get<any>(`${url1.RecommendedProperty}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response;
    } catch (error) {
      console.error('Error in RecommendedProperty', error);
      throw error;
    }
  }
}
export default BuyerService;
