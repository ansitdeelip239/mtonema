import {useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions} from '@tanstack/react-query';
import {Response} from '../types';

// Use existing Response type from your API setup
export type ApiResponse<T = any> = Response<T>;

// Generic error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Custom hook for GET requests
export function useApiQuery<T = any>(
  key: string[],
  apiCall: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: apiCall,
    ...options,
  });
}

// Custom hook for POST/PUT/DELETE mutations
export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}

// Hook to invalidate queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return (queryKey: string[]) => {
    queryClient.invalidateQueries({queryKey});
  };
}

// Hook to prefetch data
export function usePrefetchQuery() {
  const queryClient = useQueryClient();

  return <T = any>(key: string[], apiCall: () => Promise<T>) => {
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: apiCall,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
}

// Hook to manually set query data
export function useSetQueryData() {
  const queryClient = useQueryClient();

  return <T = any>(key: string[], data: T) => {
    queryClient.setQueryData(key, data);
  };
}

// Hook to get query data
export function useGetQueryData() {
  const queryClient = useQueryClient();

  return <T = any>(key: string[]): T | undefined => {
    return queryClient.getQueryData(key);
  };
}
