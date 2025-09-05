import {PartnerPropertyApiSubmissionType} from '../schema/PartnerPropertyFormSchema';
import url from '../constants/api';
import {api} from '../utils/api';
import {SellerPropertyResponse} from '../types';

class SellerService {
  static async addProperty(body: PartnerPropertyApiSubmissionType) {
    try {
      const response = await api.post<null>(`${url.seller.property.add}`, body);
      return response;
    } catch (error) {
      console.error('Error in addProperty', error);
      throw error;
    }
  }

  static async getPropertiesByUserId(
    userId: number,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams();
      params.append('PageNumber', pageNumber.toString());
      params.append('pageSize', pageSize.toString());

      const response = await api.get<SellerPropertyResponse>(
        `${url.seller.property.listByUserId(userId)}?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPropertiesByUserId', error);
      throw error;
    }
  }

  static async updateProperty(body: PartnerPropertyApiSubmissionType) {
    try {
      const response = await api.post<null>(
        `${url.seller.property.update}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in updateProperty', error);
      throw error;
    }
  }
}

export default SellerService;
