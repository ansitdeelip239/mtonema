import BuyerService from '../../../../services/BuyerService';
import {PropertySearchParams} from '../../../../types';

/**
 * Function for searching properties
 * @param params - Search parameters for properties
 * @returns Promise with properties data
 */
export const searchProperties = async (params: PropertySearchParams = {}) => {
  try {
    const response = await BuyerService.searchProperties(params);

    // Ensure we always return a valid data structure
    if (!response || !response.data) {
      console.warn('API response is empty or invalid:', response);
      return {
        properties: [],
        total: 0,
        pagination: {
          currentPage: params.page || 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: params.pageSize || 12,
          hasNextPage: false,
          hasPreviousPage: false,
          firstPage: 1,
          nextPage: 1,
          lastPage: 1,
        },
      };
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Return empty data structure instead of throwing
    return {
      properties: [],
      total: 0,
      pagination: {
        currentPage: params.page || 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: params.pageSize || 12,
        hasNextPage: false,
        hasPreviousPage: false,
        firstPage: 1,
        nextPage: 1,
        lastPage: 1,
      },
    };
  }
};

/**
 * Function for fetching recommended properties
 * @param pageNumber - Page number for pagination
 * @param pageSize - Number of items per page
 * @returns Promise with recommended properties data
 */
export const getRecommendedProperties = async (
  pageNumber: number,
  pageSize: number,
) => {
  try {
    const response = await BuyerService.searchProperties({
      page: pageNumber,
      pageSize: pageSize,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended properties:', error);
    // Return empty data structure instead of throwing
    return {
      properties: [],
      total: 0,
      pagination: {
        currentPage: pageNumber,
        totalPages: 1,
        totalCount: 0,
        pageSize: pageSize,
        hasNextPage: false,
        hasPreviousPage: false,
        firstPage: 1,
        nextPage: 1,
        lastPage: 1,
      },
    };
  }
};
