import {useState, useEffect, useCallback} from 'react';
import {SellerProperty} from '../../../types';
import {useAuth} from '../../../context/AuthProvider';
import SellerService from '../../../services/SellerService';

export const useDashboardPropertyList = () => {
  const {user} = useAuth();
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingStep, setLoadingStep] = useState<'count' | 'data' | 'complete'>(
    'count',
  );

  // Function to fetch total count with pageSize=1
  const fetchTotalCount = useCallback(async () => {
    if (!user?.id) {
      return 0;
    }

    try {
      const response = await SellerService.getPropertiesByUserId(user.id, 1, 1);
      if (response.success && response.data) {
        return response.data.pagination.totalCount;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching total count:', error);
      return 0;
    }
  }, [user?.id]);

  // Function to fetch all properties with total count as pageSize
  const fetchAllProperties = useCallback(
    async (count: number) => {
      if (!user?.id || count === 0) {
        return;
      }

      try {
        const response = await SellerService.getPropertiesByUserId(
          user.id,
          1,
          count,
        );
        if (response.success && response.data) {
          setProperties(response.data.properties);
          setTotalCount(response.data.pagination.totalCount);
        }
      } catch (error) {
        console.error('Error fetching all properties:', error);
      }
    },
    [user?.id],
  );

  // Main function to load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoading(true);
    setLoadingStep('count');

    try {
      // Step 1: Get total count
      const count = await fetchTotalCount();
      setLoadingStep('data');

      // Step 2: Fetch all properties if count > 0
      if (count > 0) {
        await fetchAllProperties(count);
      }

      setLoadingStep('complete');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, fetchTotalCount, fetchAllProperties]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id, loadDashboardData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  // Calculate metrics from all loaded properties
  const activeProperties = properties.filter(
    p => p.recordstatus === 'Active',
  ).length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const propertyTypes = properties.reduce((acc, property) => {
    const type = property.propertyType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPropertyType = Object.entries(propertyTypes).sort(
    ([, a], [, b]) => b - a,
  )[0];
  const recentProperties = properties
    .sort(
      (a, b) =>
        new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
    )
    .slice(0, 3);

  return {
    properties,
    isLoading,
    refreshing,
    totalCount,
    loadingStep,
    activeProperties,
    featuredProperties,
    topPropertyType,
    recentProperties,
    handleRefresh,
  };
};
