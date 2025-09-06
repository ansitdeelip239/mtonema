import {useState, useEffect, useCallback} from 'react';
import {SellerProperty} from '../../../types';
import {useAuth} from '../../../context/AuthProvider';
import SellerService from '../../../services/SellerService';

export const usePropertyList = (pageSize: number = 12) => {
  const {user} = useAuth();
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Function to fetch properties
  const fetchProperties = useCallback(async (page: number, isLoadMore = false) => {
    if (!user?.id) {
      return;
    }

    try {
      if (!isLoadMore) {
        setIsLoading(true);
        setProperties([]);
      } else {
        setIsLoadingMore(true);
      }

      const response = await SellerService.getPropertiesByUserId(user.id, page, pageSize);

      if (response.success && response.data) {
        const propertiesData = response.data.properties;

        if (isLoadMore) {
          setProperties(prev => [...prev, ...propertiesData]);
        } else {
          setProperties(propertiesData);
        }

        setTotalCount(response.data.pagination.totalCount);
        setHasMoreData(response.data.pagination.nextPage && propertiesData.length === pageSize);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [user?.id, pageSize]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchProperties(1, false);
      setCurrentPage(1);
    }
  }, [user?.id, fetchProperties]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchProperties(1, false);
  }, [fetchProperties]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProperties(nextPage, true);
    }
  }, [isLoading, isLoadingMore, hasMoreData, currentPage, fetchProperties]);

  return {
    properties,
    isLoading,
    isLoadingMore,
    refreshing,
    totalCount,
    hasMoreData,
    handleRefresh,
    handleLoadMore,
  };
};
