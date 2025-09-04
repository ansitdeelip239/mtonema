import {useApiQuery} from '../../../../hooks/useApi';
import {queryKeys} from '../../../../utils/queryKeys';
import BuyerService from '../../../../services/BuyerService';
import {PropertySearchParams} from '../../../../types';

/**
 * React Query hook for searching properties
 * @param params - Search parameters for properties
 * @returns Query result with properties data
 */
export const useSearchProperties = (params: PropertySearchParams = {}) => {
  return useApiQuery(
    queryKeys.properties.list({
      page: params.page,
      limit: params.pageSize,
      search: params.location || '',
      category: params.propertyType || '',
      status: params.propertyFor || '',
    }),
    () => BuyerService.searchProperties(params).then(response => response.data),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes for search results
      retry: 3,
      enabled: true, // Always enabled for search
    }
  );
};

/**
 * React Query hook for fetching recommended properties
 * @param pageNumber - Page number for pagination
 * @param pageSize - Number of items per page
 * @returns Query result with recommended properties data
 */
export const useRecommendedProperties = (pageNumber: number, pageSize: number) => {
  return useApiQuery(
    queryKeys.properties.list({
      page: pageNumber,
      limit: pageSize,
    }),
    () => BuyerService.RecommendedProperty(pageNumber, pageSize).then(response => response.data),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes for recommended properties
      retry: 2,
    }
  );
};
