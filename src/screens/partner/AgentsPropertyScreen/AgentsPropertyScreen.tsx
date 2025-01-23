import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {AgentData, PagingModel} from '../../../types';
import renderItem from './components/RenderItem';
import renderFooter from './components/RenderFooter';

export default function AgentDataScreen() {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const {user} = useAuth();
  const PAGE_SIZE = 10;

  const fetchAgentData = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        setIsLoading(true);
        const response = await PartnerService.getAgentImportData(
          page,
          PAGE_SIZE,
          user?.Email || '',
          '',
          '',
          '',
        );

        const newData = response.data.AgentDataModel;
        const pagingInfo: PagingModel = response.data.responsePagingModel;

        if (shouldRefresh) {
          setAgentData(newData);
        } else {
          setAgentData(prev => [...prev, ...newData]);
        }

        setHasMoreData(pagingInfo.CurrentPage < pagingInfo.TotalPage);
        setCurrentPage(pagingInfo.CurrentPage);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.Email],
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
