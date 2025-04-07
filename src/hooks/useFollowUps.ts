import {useState, useCallback} from 'react';
import PartnerService from '../services/PartnerService';
import {FollowUpType} from '../types';
import { useAuth } from './useAuth';

export const useFollowUps = (
  type: 'today' | 'someday' | 'overdue' | 'upcoming',
) => {
  const [followUps, setFollowUps] = useState<FollowUpType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchData = useCallback(
    async (isRefreshing = false) => {
      if (isRefreshing) {
        setRefreshing(true);
      }

      setIsLoading(true);
      try {
        const response = await PartnerService.getFollowUpByUserId(user?.id as number, type);
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
    [type, user?.id],
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
