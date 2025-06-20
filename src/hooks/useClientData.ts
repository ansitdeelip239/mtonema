import {useState, useCallback, useEffect, useRef} from 'react';
import {Client, PagingModel} from '../types';
import {useAuth} from './useAuth';
import PartnerService from '../services/PartnerService';
import {usePartner} from '../context/PartnerProvider';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'createdOn' | 'activity'>('createdOn');
  const [paging, setPaging] = useState<PagingModel>({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPage: 1,
    nextPage: false,
    previousPage: false,
  });

  // Use ref to track sort parameters changes without affecting dependencies
  const sortDirectionRef = useRef(sortDirection);
  const sortByRef = useRef(sortBy);
  // Track if sort was manually triggered
  const manualSortRef = useRef(false);

  const {user} = useAuth();
  const {clientsUpdated, selectedPartnerIds} = usePartner();

  // Update refs when sort parameters change
  useEffect(() => {
    sortDirectionRef.current = sortDirection;
  }, [sortDirection]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  const fetchClients = useCallback(
    async (
      page: number = 1,
      search?: string,
      sort?: 'asc' | 'desc',
      sortByParam?: 'createdOn' | 'activity',
    ) => {
      setError(null);
      try {
        // Use the provided parameters or the current ref values
        const currentSort = sort || sortDirectionRef.current;
        const currentSortBy = sortByParam || sortByRef.current;

        // Determine which user IDs to use:
        // - If selectedPartnerIds is not empty, use those
        // - Otherwise, use the logged-in user's ID
        let userIdsToFetch: string;

        if (selectedPartnerIds.length > 0) {
          // Use selected partner IDs (comma-separated string)
          userIdsToFetch = selectedPartnerIds.join(',');
        } else {
          // Use logged-in user's ID
          userIdsToFetch = user?.id.toString() || '0';
        }

        const response = await PartnerService.getClientData(
          userIdsToFetch,
          page,
          paging.pageSize,
          search,
          currentSort,
          currentSortBy,
        );

        if (page === 1) {
          setClients(response.data.clientDataModel || []);
        } else {
          setClients(prev => [
            ...prev,
            ...(response.data.clientDataModel || []),
          ]);
        }

        setPaging(response.data.responsePagingModel);
      } catch (err) {
        setError('Failed to fetch clients');
      }
    },
    [user?.id, paging.pageSize, selectedPartnerIds],
  );

  const handleSearch = useCallback(
    async (text: string) => {
      await fetchClients(1, text);
    },
    [fetchClients],
  );

  const handleFilterChange = useCallback(
    async (
      newSortBy: 'createdOn' | 'activity',
      newSortDirection: 'asc' | 'desc',
    ) => {
      // Set flag to prevent duplicate fetches
      manualSortRef.current = true;

      setSortBy(newSortBy);
      setSortDirection(newSortDirection);
      setClients([]); // Clear clients for better UX
      setIsLoading(true);

      try {
        await fetchClients(1, undefined, newSortDirection, newSortBy);
      } finally {
        setIsLoading(false);
        // Reset flag after fetch completes
        setTimeout(() => {
          manualSortRef.current = false;
        }, 100);
      }
    },
    [fetchClients],
  );

  const loadMoreClients = useCallback(async () => {
    if (paging.nextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      await fetchClients(paging.currentPage + 1);
      setIsLoadingMore(false);
    }
  }, [fetchClients, paging.nextPage, paging.currentPage, isLoadingMore]);

  // Main effect to load clients when dependencies change
  useEffect(() => {
    // Skip if this is from a manual sort action
    if (manualSortRef.current) {
      return;
    }

    // Clear existing clients when filter changes
    setClients([]);
    setIsLoading(true);

    fetchClients().finally(() => setIsLoading(false));
  }, [fetchClients, clientsUpdated, selectedPartnerIds]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  return {
    clients,
    isLoading,
    isLoadingMore,
    error,
    refreshing,
    sortDirection,
    sortBy,
    fetchClients,
    onRefresh,
    handleSearch,
    handleFilterChange,
    loadMoreClients,
  };
};
