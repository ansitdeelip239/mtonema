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
import {ContactedPropertyModel} from '../../../../types/admin';
import ContactedPropertyCard from './components/ContactedPropertyCard';

const ContactedPropertiesScreen = () => {
  const [properties, setProperties] = useState<ContactedPropertyModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchProperties = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        setLoading(true);
        const response = await AdminService.getAllContactedProperty(
          page,
          PAGE_SIZE,
        );

        const newProperties = response.data.contactedPropertyModels;
        const pagingInfo = response.data.responsePagingModel;

        if (shouldRefresh) {
          setProperties(newProperties);
        } else {
          setProperties(prev => [...prev, ...newProperties]);
        }

        setHasMore(pagingInfo.CurrentPage < pagingInfo.TotalPage);
        setCurrentPage(pagingInfo.CurrentPage);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProperties(1, true);
  }, [fetchProperties]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties(1, true);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(currentPage + 1);
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

  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contacted properties found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Contacted Properties" />
      <FlatList
        data={properties}
        renderItem={({item}) => <ContactedPropertyCard property={item} />}
        keyExtractor={item => item.ID.toString()}
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

export default ContactedPropertiesScreen;
