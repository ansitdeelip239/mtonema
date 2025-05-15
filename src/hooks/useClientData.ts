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
  const [paging, setPaging] = useState<PagingModel>({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPage: 1,
    nextPage: false,
    previousPage: false,
  });

  // Use ref to track sort direction changes without affecting dependencies
  const sortDirectionRef = useRef(sortDirection);
  // Track if sort was manually triggered
  const manualSortRef = useRef(false);

  const {user} = useAuth();
  const {clientsUpdated} = usePartner();

  // Update ref when sortDirection state changes
  useEffect(() => {
    sortDirectionRef.current = sortDirection;
  }, [sortDirection]);

  const fetchClients = useCallback(
    async (page: number = 1, search?: string, sort?: 'asc' | 'desc') => {
      setError(null);
      try {
        // Use the provided sort direction or the current ref value
        const currentSort = sort || sortDirectionRef.current;
        const response = await PartnerService.getClientData(
          user?.email || '',
          page,
          paging.pageSize,
          search,
          currentSort,
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
    [user?.email, paging.pageSize],
  );

  const handleSearch = useCallback(
    async (text: string) => {
      await fetchClients(1, text);
    },
    [fetchClients],
  );

  const handleSort = useCallback(async () => {
    // Set flag to prevent duplicate fetches
    manualSortRef.current = true;

    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newSortDirection);
    setClients([]); // Clear clients for better UX
    setIsLoading(true);

    try {
      await fetchClients(1, undefined, newSortDirection);
    } finally {
      setIsLoading(false);
      // Reset flag after fetch completes
      setTimeout(() => {
        manualSortRef.current = false;
      }, 100);
    }
  }, [sortDirection, fetchClients]);

  const loadMoreClients = useCallback(async () => {
    if (paging.nextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      await fetchClients(paging.currentPage + 1);
      setIsLoadingMore(false);
    }
  }, [fetchClients, paging.nextPage, paging.currentPage, isLoadingMore]);

  useEffect(() => {
    // Skip if this is from a manual sort action
    if (manualSortRef.current) {
      return;
    }

    setIsLoading(true);
    fetchClients().finally(() => setIsLoading(false));
  }, [user?.email, fetchClients, clientsUpdated]);

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
    fetchClients,
    onRefresh,
    handleSearch,
    handleSort,
    loadMoreClients,
  };
};
