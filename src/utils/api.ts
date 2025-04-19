import {Response} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}) {
  const url = `${endpoint}`;

  let token: string | null = await AsyncStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && {Authorization: `Bearer ${token}`}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log(url, config);
    const response = await fetch(url, config);

    const data: Response<T> = await response.json();

    if (data.success === false) {
      throw new Error(data.message || 'API request failed');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
    } else {
      console.error('API Error:', error);
    }
    throw error;
  }
}

interface API {
  get<T>(endpoint: string): Promise<Response<T>>;
  post<T>(endpoint: string, data: any): Promise<Response<T>>;
  put<T>(endpoint: string, data: any): Promise<Response<T>>;
  delete<T>(endpoint: string): Promise<Response<T>>;
  patch<T>(endpoint: string, data: any): Promise<Response<T>>;
}

export const api: API = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint, {method: 'GET'}),
  post: <T>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, {method: 'DELETE'}),
  patch: <T>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
};
