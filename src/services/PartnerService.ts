import url from '../constants/api';
import {PartnerPropertyApiSubmissionType} from '../schema/PartnerPropertyFormSchema';
import {
  PropertiesResponse,
  Property,
} from '../screens/partner/ListingsScreen/types';
import {
  AgentPropertyRequestModel,
  Client,
  ClientForm,
  ClientResponseModel,
  ContentTemplatesData,
  CustomerTestimonialResponse,
  FollowUp,
  FollowUpResponseModel,
  FollowUpType,
  Group2Response,
  GroupResponse,
  User,
} from '../types';
import {api} from '../utils/api';

interface AssignClientResponse {
  clientId: number;
  removedAssignments: number[];
  newAssignments: number[];
  activityAdded: string;
}

class PartnerService {
  static async getAgentProperties(
    pageNumber: number,
    pageSize: number,
    partnerId: string,
    agentName: string,
    areaLocality: string,
    propertyType: string,
    bhkType: string,
  ) {
    try {
      const params = new URLSearchParams({
        email: partnerId,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        agentName,
        areaLocality,
        propertyType,
        bhkType,
      }).toString();
      const response = await api.get<any>(
        `${url.agentPropertiesNew}?${params}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async addAgentProperty(body: AgentPropertyRequestModel) {
    try {
      const response = await api.post<null>(`${url.addAgentProperties}`, body);
      return response;
    } catch (error) {
      console.error('Error in updateAgentProperty', error);
      throw error;
    }
  }

  static async updateAgentProperty(
    body: AgentPropertyRequestModel,
    id: number,
  ) {
    try {
      const response = await api.put<null>(
        `${url.agentProperties}/${id}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in updateAgentProperty', error);
      throw error;
    }
  }

  static async getClientData(
    id: number,
    pageNumber: number,
    pageSize: number,
    searchKey?: string,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: 'createdOn' | 'activity' = 'createdOn',
  ) {
    try {
      const params = new URLSearchParams({
        userIds: id.toString(),
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        searchKey: searchKey || '',
        sortDirection,
        sortBy,
      }).toString();
      const response = await api.get<ClientResponseModel>(
        `${url.getClients}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getClientData', error);
      throw error;
    }
  }

  static async getGroups(email: string) {
    try {
      const params = new URLSearchParams({
        email,
      }).toString();
      const response = await api.get<GroupResponse>(
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
      const response = await api.post<string | null>(`${url.addClients}`, body);
      return response;
    } catch (error) {
      console.error('Error in addClient', error);
      throw error;
    }
  }

  static async getPartnerProperty(
    partnerId: number,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await api.get<any>(
        `${url.users}/${partnerId}/partner-properties?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPartnerProperty', error);
      throw error;
    }
  }

  static async deleteAgentProperty(agentPropertyId: number) {
    try {
      const response = await api.delete<null>(
        `${url.deleteAgentProperty}?agentPropertyId=${agentPropertyId}`,
      );
      return response;
    } catch (error) {
      console.error('Error in deleteAgentProperty', error);
      throw error;
    }
  }

  static async getClientById(clientId: number) {
    try {
      const response = await api.get<Client>(`${url.clients}/${clientId}`);

      return response;
    } catch (error) {
      console.error('Error in getClientById', error);
      throw error;
    }
  }

  static async deleteClientById(clientId: number) {
    try {
      const response = await api.delete<null>(`${url.clients}/${clientId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteClientById', error);
      throw error;
    }
  }

  static async addEditClientActivity(
    activityType: number,
    clientId: number,
    description: string,
    partnerId: string,
    id?: number,
  ) {
    try {
      const body = {
        activityType: activityType,
        clientId: clientId,
        description: description,
        partnerId: partnerId,
        ...(id && {id: id}),
      };
      const response = await api.post<null>(
        `${url.addEditClientActivity}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in addEditClientActivity', error);
      throw error;
    }
  }

  static async deleteClientActivity(activityId: number) {
    try {
      const response = await api.delete<null>(
        `${url.deleteClientActivity}?Id=${activityId}`,
      );
      return response;
    } catch (error) {
      console.error('Error in deleteClientActivity', error);
      throw error;
    }
  }

  static async getGroupsByEmail(
    email: string,
    pageNumber?: number,
    pageSize?: number,
  ) {
    try {
      const params = new URLSearchParams({
        email,
        ...(pageNumber && {pageNumber: pageNumber.toString()}),
        ...(pageSize && {pageSize: pageSize.toString()}),
      }).toString();

      const response = await api.get<Group2Response>(`${url.groups}?${params}`);
      return response;
    } catch (error) {
      console.error('Error in getGroupsByEmail', error);
      throw error;
    }
  }

  static async createGroup(
    groupName: string,
    colorId: number,
    email: string,
    groupId?: number,
  ) {
    try {
      const payload = {
        groupName,
        colorId,
        email,
        ...(groupId && {id: groupId}),
      };

      const response = await api.post<null>(`${url.addGroups}`, payload);
      return response;
    } catch (error) {
      console.error('Error in createGroup', error);
      throw error;
    }
  }

  static async deleteGroup(groupId: number) {
    try {
      const response = await api.delete<null>(`${url.groups}/${groupId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteGroup', error);
      throw error;
    }
  }

  static async getFollowUpDate(clientId: number) {
    try {
      const params = new URLSearchParams({
        clientId: clientId.toString(),
      }).toString();

      const response = await api.get<
        | {
            clientId: number;
            clientName: string;
            displayName: string;
            followUp: FollowUp | null;
          }
        | {
            clientId: number;
            followUp: null;
          }
      >(`${url.followUps}/client?${params}`);
      return response;
    } catch (error) {
      console.error('Error in getFollowUpDate', error);
      throw error;
    }
  }

  static async getFollowUpByUserId(
    userId: number,
    filter: string,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        filter,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      }).toString();

      const response = await api.get<FollowUpResponseModel>(
        `${url.followUps}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getFollowUpByUserId', error);
      throw error;
    }
  }

  static async scheduleFollowUp(payload: {
    clientId: number;
    userId: number;
    followUpDate: string | null;
    status: string;
  }) {
    try {
      const response = await api.post<FollowUpType>(
        `${url.followUps}`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in getFollowUpByUserId', error);
      throw error;
    }
  }

  static async deleteFollowUp(followUpId: number) {
    try {
      const response = await api.delete<null>(`${url.followUps}/${followUpId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteFollowUp', error);
      throw error;
    }
  }

  static async completeFollowUp(followUpId: number, status: string) {
    try {
      const response = await api.put<null>(`${url.followUps}/${followUpId}`, {
        status: status,
      });
      return response;
    } catch (error) {
      console.error('Error completing follow-up:', error);
      throw error;
    }
  }

  static async postPartnerProperty(payload: PartnerPropertyApiSubmissionType) {
    try {
      const response = await api.post<null>(
        `${url.addPartnerProperty}`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in postPartnerProperty', error);
      throw error;
    }
  }

  static async getPartnerPropertyByUserId(
    email: string,
    pageNumber: number,
    pageSize: number,
    searchQuery?: string,
    propertyFor?: string,
    status?: string,
    location?: string,
  ) {
    try {
      const params = new URLSearchParams({
        email,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        ...(searchQuery && {searchQuery}),
        ...(propertyFor && {propertyFor}),
        ...(status && {status}),
        ...(location && {location}),
      }).toString();

      const response = await api.get<PropertiesResponse>(
        url.partnerPropertyNew + `?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPartnerPropertyByUserId', error);
      throw error;
    }
  }

  static async getPartnerPropertyById(id: number) {
    try {
      const response = await api.get<Property>(url.partnerProperty + `/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getPartnerPropertyById', error);
      throw error;
    }
  }

  static async featuredProperty(propertyId: number, isFeatured: boolean) {
    try {
      const response = await api.patch<null>(
        `${url.partnerProperty}/${propertyId}`,
        {
          isFeatured: isFeatured,
        },
      );
      return response;
    } catch (error) {
      console.error('Error in featuredProperty', error);
      throw error;
    }
  }

  static async deletePartnerProperty(propertyId: number) {
    try {
      const response = await api.delete<null>(
        url.deletePartnerPropertyById(propertyId),
      );
      return response;
    } catch (error) {
      console.error('Error in deletePartnerProperty', error);
      throw error;
    }
  }

  static async updatePartnerProperty(
    propertyId: number,
    data: PartnerPropertyApiSubmissionType,
  ) {
    try {
      const response = await api.put(
        `${url.partnerProperty}/${propertyId}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating partner property:', error);
      throw error;
    }
  }

  static async getPartnerCustomerTestimonial(
    createdBy: string,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams({
        createdBy,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      }).toString();

      const response = await api.get<CustomerTestimonialResponse>(
        `${url.feedback}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPartnerCustomerTestimonial', error);
      throw error;
    }
  }

  static async getAssignedUsers(clientId: number) {
    try {
      const response = await api.get<number[]>(url.getAssignedUsers(clientId));
      return response;
    } catch (error) {
      console.error('Error in getAssignedUsers', error);
      throw error;
    }
  }

  static async getTeamMembers(email: string) {
    try {
      const params = new URLSearchParams({
        email,
      }).toString();
      const response = await api.get<User[]>(url.teamMembers + `?${params}`);
      return response;
    } catch (error) {
      console.error('Error in getTeamMembers', error);
      throw error;
    }
  }

  static async assignClient(payload: {clientId: number; userId: number[]}) {
    try {
      const response = await api.post<AssignClientResponse>(
        url.assignClient,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in assignClient', error);
      throw error;
    }
  }

  static async getContentTemplates(
    userId: number,
    pageNumber: number,
    pageSize: number,
    searchKey?: string,
  ) {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        ...(searchKey && {searchKey}),
      }).toString();

      const response = await api.get<ContentTemplatesData>(
        `${url.contentTemplates}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getContentTemplates', error);
      throw error;
    }
  }

  static async createContentTemplate(
    userId: number,
    payload: {
      name: string;
      content: string;
    },
  ) {
    try {
      const response = await api.post<null>(
        `${url.addContentTemplate(userId)}`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in createContentTemplate', error);
      throw error;
    }
  }

  static async updateContentTemplate(
    userId: number,
    templateId: number,
    payload: {
      name: string;
      content: string;
    },
  ) {
    try {
      const response = await api.put<null>(
        `${url.updateContentTemplate(userId, templateId)}`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in createContentTemplate', error);
      throw error;
    }
  }
}

export default PartnerService;
