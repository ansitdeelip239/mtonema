import url1 from '../constants/api';
import {api} from '../utils/api';

class BuyerService {
  static async RecommendedProperty(pageNumber: number, pageSize: number) {
    try {
      const response = await api.get<any>(
        `${url1.RecommendedProperty}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error('Error in RecommendedProperty', error);
      throw error;
    }
  }
  static async getPlaces(text: string, city: string) {
    try {
      const response = await api.get<any>(
        `${url1.getPlaces}?text=${text}&city=${city}`,
      );
      return response;
    } catch (error) {
      console.log('Error in getplaces', error);
    }
  }
  static async deleteProperty(id:number)
  {
    try {
      const response = await api.get<any>(
        `${url1.deleteProperty}?id=${id}`,
      );
      return response;
    } catch (error) {
      console.log('Error in deleteProperty', error);
    }
  }
  static async filterProperties(filterCriteria: {
    Address?: string;
    place:string[];
    City: string;
    Price?: string;
    PropertyType?: string;
    PropertyFor?: string;
    SellerType?: string;
    MinPrice?: number;
    MaxPrice?: number;
    BhkType?: string;
    FurnishType?: string;
    ZipCode?: string;
    pageNumber?: number;
    pageSize?: number;
    Relevance?: string;
  }) {
    try {
      const response = await api.post<any>(url1.FilterSearch, filterCriteria);
      return response;
    } catch (error) {
      console.error('Error in filterProperties', error);
      throw error;
    }
  }
}

export default BuyerService;
