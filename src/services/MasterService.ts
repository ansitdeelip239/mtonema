import {MasterDetailModel, SearchIntellisenseResponse} from '../types';
import {api} from '../utils/api';
import url from '../constants/api';
import {GooglePlacesResponse} from '../types/googlePlaces';

class MasterService {
  static async getMasterDetails(masterName: string, xref?: string) {
    try {
      const params = new URLSearchParams({
        masterName,
      });

      if (xref) {
        params.append('xref', xref);
      }

      const response = await api.get<MasterDetailModel[]>(
        `${url.getMasterDetail}?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async getMasterDetailsById(id: number) {
    try {
      const response = await api.get<any>(`${url.getMasterDetail}/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async searchIntellisense(
    searchType: string,
    searchKey: string,
    email?: string,
  ) {
    try {
      const params = new URLSearchParams({
        searchType,
        searchKey,
      });

      if (email) {
        params.append('email', email);
      }

      const response = await api.get<SearchIntellisenseResponse[]>(
        `${url.searchIntellisense}?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Error in searchIntellisense', error);
      throw error;
    }
  }

  static async getGooglePlaces(text: string, city?: string) {
    try {
      if (city) {
        const response = await api.get<GooglePlacesResponse>(
          `${url.getPlaces}?text=${text}&city=${city}`,
        );
        return response;
      }
      const response = await api.get<GooglePlacesResponse>(
        `${url.getPlaces}?text=${text}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getGooglePlaces', error);
      throw error;
    }
  }
}
export default MasterService;
