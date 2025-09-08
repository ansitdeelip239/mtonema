import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../../../context/AuthProvider';
import BuyerService from '../../../services/BuyerService';
import {Property} from '../../../types';

export interface DashboardStats {
  totalContacted: number;
}

export interface DashboardData {
  stats: DashboardStats;
  forSaleProperties: Property[];
  forRentProperties: Property[];
  featuredProperties: Property[];
  contactedProperties: Property[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export const useDashboardData = () => {
  const {user} = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalContacted: 0,
    },
    forSaleProperties: [],
    forRentProperties: [],
    featuredProperties: [],
    contactedProperties: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (!user?.id) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'User not authenticated',
      }));
      return;
    }

    try {
      if (isRefresh) {
        setDashboardData(prev => ({...prev, refreshing: true, error: null}));
      } else {
        setDashboardData(prev => ({...prev, loading: true, error: null}));
      }

      // Fetch different property types using searchProperties with filters
      const [
        forSaleResponse,
        forRentResponse,
        featuredResponse,
        contactedResponse,
      ] = await Promise.allSettled([
        BuyerService.searchProperties({
          propertyFor: 'Sale',
          page: 1,
          pageSize: 6,
        }),
        BuyerService.searchProperties({
          propertyFor: 'Rent',
          page: 1,
          pageSize: 6,
        }),
        BuyerService.searchProperties({
          isFeatured: true,
          page: 1,
          pageSize: 6,
        }),
        BuyerService.getContactedProperties(user.id, 1, 5),
      ]);

      let stats: DashboardStats = {
        totalContacted: 0,
      };

      let forSaleProperties: Property[] = [];
      let forRentProperties: Property[] = [];
      let featuredProperties: Property[] = [];
      let contactedProperties: Property[] = [];

      // Process for sale properties
      if (forSaleResponse.status === 'fulfilled' && forSaleResponse.value?.success) {
        const data = forSaleResponse.value.data;
        if (data?.properties && Array.isArray(data.properties)) {
          forSaleProperties = data.properties;
        }
      }

      // Process for rent properties
      if (forRentResponse.status === 'fulfilled' && forRentResponse.value?.success) {
        const data = forRentResponse.value.data;
        if (data?.properties && Array.isArray(data.properties)) {
          forRentProperties = data.properties;
        }
      }

      // Process featured properties
      if (featuredResponse.status === 'fulfilled' && featuredResponse.value?.success) {
        const data = featuredResponse.value.data;
        if (data?.properties && Array.isArray(data.properties)) {
          featuredProperties = data.properties;
        }
      }

      // Process contacted properties
      if (contactedResponse.status === 'fulfilled' && contactedResponse.value?.success) {
        const data = contactedResponse.value.data;
        if (data?.contactedProperties && Array.isArray(data.contactedProperties)) {
          contactedProperties = data.contactedProperties;
        }
        stats.totalContacted = data?.total || contactedProperties.length;
      }

      setDashboardData(prev => ({
        ...prev,
        stats,
        forSaleProperties,
        forRentProperties,
        featuredProperties,
        contactedProperties,
        loading: false,
        refreshing: false,
        error: null,
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: 'Failed to load dashboard data',
      }));
    }
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, fetchDashboardData]);

  const retryFetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...dashboardData,
    onRefresh,
    retryFetch,
  };
};
