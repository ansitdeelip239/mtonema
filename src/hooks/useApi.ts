import React from 'react';
import {Response} from '../types';

// Use existing Response type from your API setup
export type ApiResponse<T = any> = Response<T>;

// Generic error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Simple utility function for making API calls
export async function makeApiCall<T = any>(
  apiCall: () => Promise<T>
): Promise<{ data: T | null; error: ApiError | null; isLoading: boolean }> {
  try {
    const data = await apiCall();
    return { data, error: null, isLoading: false };
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.message || 'An error occurred',
      status: error.status || error.response?.status,
      code: error.code,
    };
    return { data: null, error: apiError, isLoading: false };
  }
}

// Simple hook for API calls with loading state
export function useApiCall<T = any>(
  apiCall: () => Promise<T>
) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const execute = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'An error occurred',
        status: err.status || err.response?.status,
        code: err.code,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  return {
    data,
    error,
    isLoading,
    execute,
    refetch: execute,
  };
}

// Simple mutation hook replacement
export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [data, setData] = React.useState<TData | null>(null);

  const mutate = React.useCallback(async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'An error occurred',
        status: err.status || err.response?.status,
        code: err.code,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn]);

  return {
    mutate,
    data,
    error,
    isLoading,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
}
