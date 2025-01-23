import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {AgentData, FilterValues, PagingModel} from '../../../types';
import renderItem from './components/RenderItem';
import renderFooter from './components/RenderFooter';
import SearchHeader from './components/SearchHeader';

export default function AgentDataScreen() {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    propertyLocation: null,
    propertyType: null,
    bhkType: null,
  });
  const {user} = useAuth();
  const PAGE_SIZE = 10;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchAgentData(1, true);
  };

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchAgentData(1, true);
  };

  const DEFAULT_PAGING_MODEL: PagingModel = useMemo(
    () => ({
      CurrentPage: 1,
      NextPage: false,
      PageSize: 10,
      PreviousPage: false,
      TotalCount: 0,
      TotalPage: 1,
    }),
    [],
  );

  const fetchAgentData = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        setIsLoading(true);
        const response = await PartnerService.getAgentImportData(
          page,
          PAGE_SIZE,
          user?.Email || '',
          searchQuery,
          filters.propertyLocation || '',
          filters.propertyType || '',
          filters.bhkType || '',
        );

        // Safe null checks for response data
        const newData = response?.data?.AgentDataModel ?? [];
        const pagingInfo: PagingModel =
          response?.data?.responsePagingModel ?? DEFAULT_PAGING_MODEL;

        if (shouldRefresh) {
          setAgentData(newData);
        } else {
          setAgentData(prev => [...prev, ...newData]);
        }

        // Safe checks for paging info
        const hasMore = Boolean(
          pagingInfo?.CurrentPage &&
            pagingInfo?.TotalPage &&
            pagingInfo.CurrentPage < pagingInfo.TotalPage,
        );

        setHasMoreData(hasMore);
        setCurrentPage(pagingInfo?.CurrentPage ?? 1);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        if (shouldRefresh) {
          setAgentData([]);
        }
        setHasMoreData(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.Email, searchQuery, filters, DEFAULT_PAGING_MODEL],
  );

  useEffect(() => {
    fetchAgentData(1, true);
  }, [user?.Email, fetchAgentData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchAgentData(1, true);
  }, [fetchAgentData]);

  const handleLoadMore = () => {
    if (!isLoading && hasMoreData) {
      fetchAgentData(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <SearchHeader initialFilters={filters} onSearch={handleSearch} onFilter={handleFilter} />
      <FlatList
        data={agentData}
        renderItem={renderItem}
        keyExtractor={item => item.Id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter({isLoading})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
});
