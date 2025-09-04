import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {queryClient, asyncStoragePersister} from '../utils/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({children}) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }}>
      {children}
    </PersistQueryClientProvider>
  );
};

// Alternative simpler provider without persistence
export const SimpleQueryProvider: React.FC<QueryProviderProps> = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
