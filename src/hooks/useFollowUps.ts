import {useState, useCallback, useRef} from 'react';
import PartnerService from '../services/PartnerService';
import {FollowUpType, PagingModel} from '../types';
import {useAuth} from './useAuth';

export const useFollowUps = (
  type: 'today' | 'someday' | 'overdue' | 'upcoming',
  initialPageSize: number = 10, // Default page size
) => {
  const [followUps, setFollowUps] = useState<FollowUpType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PagingModel | null>(null);
  const {user} = useAuth();
  const currentPage = useRef<number>(1);
  const hasMoreData = useRef<boolean>(true);
  const pageSize = useRef<number>(initialPageSize);

  const fetchData = useCallback(
    async (page: number, isRefreshing = false) => {
      if (isRefreshing) {
        setRefreshing(true);
        // Reset pagination state when refreshing
        currentPage.current = 1;
        hasMoreData.current = true;
      }

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await PartnerService.getFollowUpByUserId(
          user?.id as number,
          type,
          page, // Pass the page number to the API
          pageSize.current, // Pass the page size to the API
        );

        if (response.success && response.data) {
          const newFollowUps = response.data.followUpDataModel;
          const pagingInfo = response.data.responsePagingModel;

          // Update pagination information
          setPagination(pagingInfo);

          // Check if we've reached the end of the data
          hasMoreData.current = pagingInfo.nextPage;

          // If refreshing or first page, replace the data
          // Otherwise, append to existing data
          if (isRefreshing || page === 1) {
            setFollowUps(newFollowUps);
          } else {
            setFollowUps(prevFollowUps => [...prevFollowUps, ...newFollowUps]);
          }

          // Update current page reference
          currentPage.current = pagingInfo.currentPage;
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
        if (page === 1) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [type, user?.id],
  );

  const fetchFollowUps = useCallback(() => {
    // Always fetch first page when this is called directly
    fetchData(1, false);
  }, [fetchData]);

  const loadMoreFollowUps = useCallback(() => {
    // Don't try to load more if we're already loading or there's no more data
    if (isLoading || isLoadingMore || !hasMoreData.current) {
      return;
    }

    // Load the next page
    fetchData(currentPage.current + 1, false);
  }, [fetchData, isLoading, isLoadingMore]);

  const onRefresh = useCallback(() => {
    fetchData(1, true);
  }, [fetchData]);

  // Add a function to change page size if needed
  const setPageSize = useCallback((newSize: number) => {
    pageSize.current = newSize;
    // Reset pagination and reload with new page size
    currentPage.current = 1;
    hasMoreData.current = true;
    fetchData(1, false);
  }, [fetchData]);

  return {
    followUps,
    isLoading,
    isLoadingMore,
    refreshing,
    fetchFollowUps,
    loadMoreFollowUps,
    onRefresh,
    pagination,
    hasMoreData: hasMoreData.current,
    setPageSize, // Expose function to change page size
    pageSize: pageSize.current, // Expose current page size
  };
};
