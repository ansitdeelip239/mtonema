import url from '../constants/api';
import {api} from '../utils/api';
import {PropertySearchParams, PropertySearchResponse} from '../types';

class BuyerService {
  static async searchProperties(params: PropertySearchParams = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params.pageSize) {
        queryParams.append('pageSize', params.pageSize.toString());
      }
      if (params.propertyFor) {
        queryParams.append('propertyFor', params.propertyFor);
      }
      if (params.location) {
        queryParams.append('location', params.location);
      }
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.propertyTypes) {
        queryParams.append('propertyTypes', params.propertyTypes);
      }
      if (params.minAmount) {
        queryParams.append('minPrice', params.minAmount.toString());
      }
      if (params.maxAmount) {
        queryParams.append('maxPrice', params.maxAmount.toString());
      }
      if (params.bhkType) {
        queryParams.append('bhkType', params.bhkType);
      }
      if (params.city) {
        queryParams.append('city', params.city);
      }
      if (params.listedBy) {
        queryParams.append('listedBy', params.listedBy);
      }
      if (params.isFeatured) {
        queryParams.append('isFeatured', params.isFeatured.toString());
      }
      if (params.readyToMove) {
        queryParams.append('readyToMove', params.readyToMove.toString());
      }
      if (params.status) {
        queryParams.append('status', params.status);
      }
      if (params.sourceWebsite) {
        queryParams.append('sourceWebsite', params.sourceWebsite);
      }
      // Note: Using location instead of searchFilter for search functionality

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `${url.property.search}?${queryString}`
        : url.property.search;

      const response = await api.get<PropertySearchResponse>(endpoint);
      console.log(response);

      return response;
    } catch (error) {
      console.error('Error in searchProperties', error);
      throw error;
    }
  }
  static async getPlaces(text: string, city: string) {
    try {
      const response = await api.get<any>(
        `${url.masterDetails.getPlaces}?text=${text}&city=${city}`,
      );
      return response;
    } catch (error) {
      console.log('Error in getplaces', error);
    }
  }
  static async deleteProperty(id: number) {
    try {
      const response = await api.get<any>(
        `${url.seller.property.delete}?id=${id}`,
      );
      return response;
    } catch (error) {
      console.log('Error in deleteProperty', error);
    }
  }
  static async contactProperty(buyerId: number, propertyId: number) {
    try {
      const response = await api.post<any>(
        url.property.contacted,
        {
          buyerId,
          propertyId,
        },
      );
      return response;
    } catch (error) {
      console.error('Error in contactProperty', error);
      throw error;
    }
  }

  static async getContactedProperties(buyerId: number, page: number = 1, pageSize: number = 10) {
    try {
      const response = await api.get<any>(
        `${url.property.getContactedProperties}?buyerId=${buyerId}&page=${page}&pageSize=${pageSize}`,
      );
      return response;
    } catch (error) {
      console.error('Error in getContactedProperties', error);
      throw error;
    }
  }
}

export default BuyerService;
