import url from '../constants/api';
import {PartnerPropertyApiSubmissionType} from '../schema/PartnerPropertyFormSchema';
import {
  PropertiesResponse,
  Property,
} from '../screens/partner/ListingsScreen/types';
import {
  AddTeamMemberResponse,
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
  TransactionFilters,
  TransactionResponse,
  User,
} from '../types';
import {NextBillResponse, PayNextBillData} from '../types/payment';
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
        `${url.partners.agentProperties.new}?${params}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error in getMasterDetails', error);
      throw error;
    }
  }

  static async addAgentProperty(body: AgentPropertyRequestModel) {
    try {
      const response = await api.post<null>(`${url.partners.agentProperties.add}`, body);
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
        `${url.partners.agentProperties.base}/${id}`,
        body,
      );
      return response;
    } catch (error) {
      console.error('Error in updateAgentProperty', error);
      throw error;
    }
  }

  static async getClientData(
    ids: string,
    pageNumber: number,
    pageSize: number,
    searchKey?: string,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: 'createdOn' | 'activity' = 'createdOn',
  ) {
    try {
      const params = new URLSearchParams({
        userIds: ids,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        searchKey: searchKey || '',
        sortDirection,
        sortBy,
      }).toString();
      const response = await api.get<ClientResponseModel>(
        `${url.partners.clients.getDataNew}?${params}`,
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
        `${url.partners.groups.list}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getGroups', error);
      throw error;
    }
  }

  static async addClient(body: ClientForm) {
    try {
      const response = await api.post<string | null>(`${url.partners.clients.add}`, body);
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
        `${url.users.list}/${partnerId}/partner-properties?${params}`,
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
        `${url.partners.agentProperties.delete}?agentPropertyId=${agentPropertyId}`,
      );
      return response;
    } catch (error) {
      console.error('Error in deleteAgentProperty', error);
      throw error;
    }
  }

  static async getClientById(clientId: number) {
    try {
      const response = await api.get<Client>(`${url.partners.clients.list}/${clientId}`);

      return response;
    } catch (error) {
      console.error('Error in getClientById', error);
      throw error;
    }
  }

  static async deleteClientById(clientId: number) {
    try {
      const response = await api.delete<null>(`${url.partners.clients.list}/${clientId}`);
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
        `${url.partners.clients.activities.addEdit}`,
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
        `${url.partners.clients.activities.delete}?Id=${activityId}`,
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

      const response = await api.get<Group2Response>(`${url.partners.groups.list}?${params}`);
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

      const response = await api.post<null>(`${url.partners.groups.addEdit}`, payload);
      return response;
    } catch (error) {
      console.error('Error in createGroup', error);
      throw error;
    }
  }

  static async deleteGroup(groupId: number) {
    try {
      const response = await api.delete<null>(`${url.partners.groups.list}/${groupId}`);
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
      >(`${url.partners.followUps}/client?${params}`);
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
        `${url.partners.followUps}?${params}`,
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
        `${url.partners.followUps}`,
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
      const response = await api.delete<null>(`${url.partners.followUps}/${followUpId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteFollowUp', error);
      throw error;
    }
  }

  static async completeFollowUp(followUpId: number, status: string) {
    try {
      const response = await api.put<null>(`${url.partners.followUps}/${followUpId}`, {
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
        `${url.partners.partnerProperties.add}`,
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
        url.partners.partnerProperties.new + `?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPartnerPropertyByUserId', error);
      throw error;
    }
  }

  static async getPartnerPropertyById(id: number) {
    try {
      const response = await api.get<Property>(url.partners.partnerProperties.base + `/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getPartnerPropertyById', error);
      throw error;
    }
  }

  static async featuredProperty(propertyId: number, isFeatured: boolean) {
    try {
      const response = await api.patch<null>(
        `${url.partners.partnerProperties.base}/${propertyId}`,
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
        url.partners.partnerProperties.deleteById(propertyId),
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
        `${url.partners.partnerProperties.base}/${propertyId}`,
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
        `${url.partners.feedback}?${params}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getPartnerCustomerTestimonial', error);
      throw error;
    }
  }

  static async getAssignedUsers(clientId: number) {
    try {
      const response = await api.get<
        {
          id: number;
          name: string;
          email: string;
        }[]
      >(url.partners.clients.getAssignedUsers(clientId));
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
      const response = await api.get<User[]>(url.partners.team.members + `?${params}`);
      return response;
    } catch (error) {
      console.error('Error in getTeamMembers', error);
      throw error;
    }
  }

  static async addTeamMember(data: {
    partnerId: number;
    name: string;
    email: string;
    phone: string;
    location: string;
  }) {
    try {
      const response = await api.post<AddTeamMemberResponse>(
        url.partners.team.getAllMembers,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error in addTeamMember', error);
      throw error;
    }
  }

  static async updateTeamMember({
    teamId,
    name,
    email,
    phone,
    location,
    isActive = true,
  }: {
    teamId: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    isActive: boolean;
  }) {
    try {
      const response = await api.put<null>(
        `${url.partners.team.getAllMembers}/${teamId}`,
        {name, email, phone, location, isActive},
      );
      return response;
    } catch (error) {
      console.error('Error in updateTeamMember', error);
      throw error;
    }
  }

  static async assignClient(payload: {clientId: number; userId: number[]}) {
    try {
      const response = await api.post<AssignClientResponse>(
        url.partners.clients.assign,
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
        `${url.partners.templates.list}?${params}`,
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
        `${url.partners.templates.add(userId)}`,
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
        `${url.partners.templates.update(userId, templateId)}`,
        payload,
      );
      return response;
    } catch (error) {
      console.error('Error in createContentTemplate', error);
      throw error;
    }
  }

  static async getAllPartners() {
    try {
      const response = await api.get<{users: User[]}>(
        url.users.list + '?role=partner',
      );
      return response;
    } catch (error) {
      console.error('Error in getAllPartners', error);
      throw error;
    }
  }

  static async getAllTeamMembers(
    partnerIds: string,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const params = new URLSearchParams({
        partnerIds,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await api.get<{
        teamMembers: {
          partnerId: number;
          teamMemberId: number;
          name: string;
          email: string;
          phone: string;
          role: string;
          location: string;
          createdOn: string;
          createdBy: string;
          recordStatus: string;
          isActive: boolean;
        }[];
        pagination: {
          totalCount: number;
          activeCount: number;
          pageSize: number;
          currentPage: number;
          totalPages: number;
          hasNext: boolean;
          hasPrevious: boolean;
        };
      }>(url.partners.team.getAllMembers + `?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error in getAllTeamMembers', error);
      throw error;
    }
  }

  static async getDuplicateClients(clientId: number) {
    try {
      const response = await api.get<Partial<Client>[]>(
        url.partners.clients.checkDuplicates + `/${clientId}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getAllPartners', error);
      throw error;
    }
  }

  static async createPaymentOrder(payload: {
    userId: number;
    planId: number;
    customerId: string;
  }) {
    try {
      const response = await api.post<{
        orderId: number;
        razorpayOrderId: string;
        customerId: string;
        keyId: string;
        remainingTrialDays: number;
        amount: number;
        planId: number;
        planName: string;
        billingCycle: string;
        durationDays: number;
      }>(url.payment.orders.create, payload);
      return response;
    } catch (error) {
      console.error('Error in createPaymentOrder', error);
      throw error;
    }
  }

  static async getPaymentPlans() {
    try {
      const response = await api.get<
        {
          id: number;
          planName: string;
          description: string;
          price: number;
          billingCycle: string;
          durationDays: number;
          maxUsers: number;
          isTrial: boolean;
          razorpayItemId: string;
        }[]
      >(url.payment.plans.list);
      return response;
    } catch (error) {
      console.error('Error in getPaymentPlans', error);
      throw error;
    }
  }

  static async addPaymentPlan(payload: {
    planName: string;
    description: string;
    price: number;
    billingCycle: string;
    durationDays: number;
    maxUsers: number;
    isTrial: boolean;
  }) {
    try {
      const response = await api.post<null>(url.payment.plans.list, payload);
      return response;
    } catch (error) {
      console.error('Error in addPaymentPlan', error);
      throw error;
    }
  }

  static async updatePaymentPlan(
    payload: {
      planName: string;
      description: string;
      price: number;
      billingCycle: string;
      durationDays: number;
      maxUsers: number;
      isTrial: boolean;
    },
    planId: number,
  ) {
    try {
      const response = await api.put<null>(url.payment.plans.list + `/${planId}`, payload);
      return response;
    } catch (error) {
      console.error('Error in updatePaymentPlan', error);
      throw error;
    }
  }

  static async deletePaymentPlan(planId: number) {
    try {
      const response = await api.delete<null>(url.payment.plans.list + `/${planId}`);
      return response;
    } catch (error) {
      console.error('Error in deletePaymentPlan', error);
      throw error;
    }
  }

  static async getSubscriptionStatus(userId: number) {
    try {
      const response = await api.get<{
        trialStatus: {
          trialStatus: string;
          trialStartDate: string;
          trialEndDate: string;
          remainingDays: number;
          convertedToPaid: boolean;
        };
        orderStatus: {
          orderId: number;
          status: string;
          paymentStatus: string;
          startDate: string;
          endDate: string;
          remainingDays: number;
          planId: number;
          planName: string;
          razorpayOrderId: string;
          amount: number;
          billingCycle: string;
          needsRenewal: boolean;
        };
        hasActiveAccess: boolean;
        trialDaysLeft: number;
        orderDaysLeft: number;
        chosenPlan: {
          planId: number;
          planName: string;
          billingCycle: string;
          amount: number;
        };
      }>(`${url.payment.orders.status}/${userId}`);
      return response;
    } catch (error) {
      console.error('Error in getSubscriptionStatus', error);
      throw error;
    }
  }

  static async getPaymentTransactions(filters: TransactionFilters = {}) {
    try {
      const params = new URLSearchParams();

      // Set default values
      params.append('pageNumber', (filters.pageNumber || 1).toString());
      params.append('pageSize', (filters.pageSize || 10).toString());
      params.append('sortBy', filters.sortBy || 'transactionDate');
      params.append('sortOrder', filters.sortOrder || 'desc');

      // Add optional filters
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.method && filters.method !== 'all') {
        params.append('method', filters.method);
      }
      if (filters.searchQuery) {
        params.append('searchQuery', filters.searchQuery);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }

      const response = await api.get<TransactionResponse>(
        `${url.payment.transactions}?${params.toString()}`,
      );

      return response;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  static async getNextBill() {
    try {
      const response = await api.get<NextBillResponse>(url.payment.billing.nextBill);
      return response;
    } catch (error) {
      console.error('Error in getNextBill', error);
      throw error;
    }
  }

  static async payNextBill() {
    try {
      const response = await api.post<PayNextBillData>(url.payment.billing.payNextBill, {});
      return response;
    } catch (error) {
      console.error('Error in payNextBill', error);
      throw error;
    }
  }

  static async switchBillingPlan(planId: number) {
    try {
      const response = await api.put<null>(url.payment.plans.switch, {planId});
      return response;
    } catch (error) {
      console.error('Error in switchBillingPlan', error);
      throw error;
    }
  }
}

export default PartnerService;
