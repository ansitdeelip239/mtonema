import url from '../constants/api';
import {
  AgentPropertyRequestModel,
  ClientForm,
  ClientResponseModel,
  Group,
} from '../types';
import {api} from '../utils/api';

class PartnerService {
  static async getAgentImportData(
    pageNumber: number,
    pageSize: number,
    partnerId: string,
    agentName: string,
    areaLocality: string,
    propertyType: string,
    flatSize: string,
  ) {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        partnerId,
        agentName,
        areaLocality,
        propertyType,
        flatSize,
      }).toString();
      const response = await api.get<any>(
        `${url.getAgentImportData}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async updateAgentProperty(body: AgentPropertyRequestModel) {
    try {
      const response = await api.post<null>(`${url.updateAgentProperty}`, body);
      return response;
    } catch (error) {
      console.error('Error in updateAgentProperty', error);
      throw error;
    }
  }

  static async getClientData(
    partnerId: string,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams({
        partnerId,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      }).toString();
      const response = await api.get<ClientResponseModel>(
        `${url.getClientData}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getClientData', error);
      throw error;
    }
  }

  static async getGroups(partnerId: string) {
    try {
      const params = new URLSearchParams({
        partnerId,
      }).toString();
      const response = await api.get<Group[]>(
        `${url.getGroupsByPartnerId}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getGroups', error);
      throw error;
    }
  }

  static async addClient(body: ClientForm) {
    try {
      const response = await api.post<string | null>(
        `${url.addEditClientData}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in addClient', error);
      throw error;
    }
  }
}
export default PartnerService;
