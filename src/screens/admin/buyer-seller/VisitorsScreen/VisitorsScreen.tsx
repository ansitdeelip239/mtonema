import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../../components/Header';
import AdminService from '../../../../services/AdminService';
import VisitorCard from './components/VisitorCard';
import {VisitorDetail} from '../../../../types/admin';

const VisitorsScreen = () => {
  const [visitors, setVisitors] = useState<VisitorDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchVisitors = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        setLoading(true);
        const response = await AdminService.getVisitors({
          pageNum: page,
          PageSize: PAGE_SIZE,
          show: PAGE_SIZE.toString(),
          Address: '',
          date: '',
        });

        const newVisitors = response.data.visitorDetailModels;
        const pagingInfo = response.data.responsePagingModel;

        if (shouldRefresh) {
          setVisitors(newVisitors);
        } else {
          setVisitors(prev => [...prev, ...newVisitors]);
        }

        setHasMore(pagingInfo.CurrentPage < pagingInfo.TotalPage);
        setCurrentPage(pagingInfo.CurrentPage);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchVisitors(1, true);
  }, [fetchVisitors]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVisitors(1, true);
  }, [fetchVisitors]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchVisitors(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No visitors found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Visitors" />
      <FlatList
        data={visitors}
        renderItem={({item}) => <VisitorCard visitor={item} />}
        keyExtractor={(item, index) => `${item.Visitor_Ip}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default VisitorsScreen;
