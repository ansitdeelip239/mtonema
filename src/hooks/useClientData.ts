import {useState, useCallback, useEffect} from 'react';
import {Client, PagingModel} from '../types';
import {useAuth} from './useAuth';
import PartnerService from '../services/PartnerService';
import {usePartner} from '../context/PartnerProvider';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [paging, setPaging] = useState<PagingModel>({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPage: 1,
    nextPage: false,
    previousPage: false,
  });

  const {user} = useAuth();
  const {clientsUpdated} = usePartner();

  const fetchClients = useCallback(
    async (page: number = 1, search?: string) => {
      setError(null);
      try {
        const response = await PartnerService.getClientData(
          user?.email || '',
          page,
          paging.pageSize,
          search,
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

  const loadMoreClients = useCallback(async () => {
    if (paging.nextPage && !isLoading) {
      setIsLoading(true);
      await fetchClients(paging.currentPage + 1);
      setIsLoading(false);
    }
  }, [fetchClients, paging.nextPage, paging.currentPage, isLoading]);

  useEffect(() => {
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
    error,
    refreshing,
    fetchClients,
    onRefresh,
    handleSearch,
    loadMoreClients,
  };
};
