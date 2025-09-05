import {PartnerPropertyApiSubmissionType} from '../schema/PartnerPropertyFormSchema';
import url from '../constants/api';
import {api} from '../utils/api';

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

  static async updateProperty(body: PartnerPropertyApiSubmissionType) {
    try {
      const response = await api.post<null>(`${url.seller.property.update}`, body);
      return response;
    } catch (error) {
      console.error('Error in updateProperty', error);
      throw error;
    }
  }
}

export default SellerService;
