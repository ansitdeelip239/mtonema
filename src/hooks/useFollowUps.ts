import {useState, useCallback} from 'react';
import PartnerService from '../services/PartnerService';
import {FollowUpType} from '../types';

export const useFollowUps = (
  type: 'today' | 'someday' | 'overdue' | 'upcoming',
) => {
  const [followUps, setFollowUps] = useState<FollowUpType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(
    async (isRefreshing = false) => {
      if (isRefreshing) {
        setRefreshing(true);
      }

      setIsLoading(true);
      try {
        const response = await PartnerService.getFollowUpByUserId(101, type);
        if (response.success && response.data) {
          setFollowUps(response.data);
        }
      } catch (error) {
        console.error(
          `Error ${
            isRefreshing ? 'refreshing' : 'fetching'
          } ${type} follow-ups:`,
          error,
        );
      } finally {
        if (isRefreshing) {
          setRefreshing(false);
        }
        setIsLoading(false);
      }
    },
    [type],
  );

  const fetchFollowUps = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    followUps,
    isLoading,
    refreshing,
    fetchFollowUps,
    onRefresh,
  };
};
