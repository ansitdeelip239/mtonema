import {useState, useCallback, useEffect} from 'react';
import {Client} from '../types';
import {useAuth} from './useAuth';
import PartnerService from '../services/PartnerService';
import {usePartner} from '../context/PartnerProvider';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useAuth();
  const {dataUpdated} = usePartner();

  const fetchClients = useCallback(
    async (search?: string) => {
      setError(null);
      try {
        const response = await PartnerService.getClientData(
          user?.Email || '',
          1,
          20,
          search,
        );
        setClients(response.data.clientDataModel || []);
      } catch (err) {
        setError('Failed to fetch clients');
      }
    },
    [user?.Email],
  );

  const handleSearch = useCallback(
    async (text: string) => {
      await fetchClients(text);
    },
    [fetchClients],
  );

  useEffect(() => {
    setIsLoading(true);
    fetchClients().finally(() => setIsLoading(false));
  }, [user?.Email, fetchClients, dataUpdated]);

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
  };
};
