import url1 from '../constants/api';
import {api} from '../utils/api';

class MasterService {
  static async getMasterDetails(masterName: string) {
    try {
      const response = await api.get<any>(url1.getMasterDetail + masterName);
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }
}
export default MasterService;
