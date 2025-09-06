import {useState, useEffect} from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { User } from '../../../types';
import AuthService from '../../../services/AuthService';

export const useUserProfile = () => {
  const {authToken} = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await AuthService.getUserByToken(authToken);
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Unable to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken]);

  const refetch = async () => {
    if (!authToken) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.getUserByToken(authToken);
      if (response.success && response.data) {
        setUserData(response.data);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error refetching user data:', err);
      setError('Unable to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!authToken) {
      return;
    }

    setRefreshing(true);
    setError(null);
    try {
      const response = await AuthService.getUserByToken(authToken);
      if (response.success && response.data) {
        setUserData(response.data);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError('Unable to refresh profile data');
    } finally {
      setRefreshing(false);
    }
  };

  return {
    userData,
    loading,
    error,
    refreshing,
    refetch,
    onRefresh,
  };
};
