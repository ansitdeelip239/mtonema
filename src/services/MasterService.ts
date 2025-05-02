import {SearchIntellisenseResponse} from '../types';
import {api} from '../utils/api';
import url from '../constants/api';

class MasterService {
  static async getMasterDetails(masterName: string) {
    try {
      const response = await api.get<any>(`${url.getMasterDetail}?masterName=${masterName}`);
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async getMasterDetailsById(id:number) {
    try {
      const response = await api.get<any>(`${url.getMasterDetail}/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async searchIntellisense(searchType: string, searchKey: string) {
    try {
      const response = await api.get<SearchIntellisenseResponse[]>(
        `${url.searchIntellisense}?searchType=${searchType}&searchKey=${searchKey}`,
      );
      return response;
    } catch (error) {
      console.error('Error in searchIntellisense', error);
      throw error;
    }
  }
}
export default MasterService;
