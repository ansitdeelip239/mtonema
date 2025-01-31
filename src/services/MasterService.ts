import url1 from '../constants/api';
import {SearchIntellisenseResponse} from '../types';
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

  static async searchIntellisense(searchType: string, searchKey: string) {
    try {
      const response = await api.get<SearchIntellisenseResponse[]>(
        `${url1.searchIntellisense}?searchType=${searchType}&searchKey=${searchKey}`,
      );
      return response;
    } catch (error) {
      console.error('Error in searchIntellisense', error);
      throw error;
    }
  }
}
export default MasterService;
