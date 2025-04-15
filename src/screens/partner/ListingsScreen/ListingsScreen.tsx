import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import Header from '../../../components/Header';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {Property, PropertiesResponse} from './types';
import Colors from '../../../constants/Colors';
import PropertyCard from './components/PropertyCard';
import EmptyListPlaceholder from './components/EmptyListPlaceholder';


const ListingsScreen = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;
  const {user} = useAuth();

  // Fetch property listings
  const fetchPropertyListings = useCallback(async (
    page: number,
    refresh: boolean = false,
  ) => {
    if (!user?.id) {
      return;
    }

    try {
      setError(null);
      if (refresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      }

      const response = await PartnerService.getPartnerPropertyByUserId(
        user.id,
        page,
        pageSize,
      );

      const data = response.data as PropertiesResponse;

      // Update pagination state
      setHasMorePages(data.pagination.nextPage);

      // Update properties list
      if (refresh || page === 1) {
        setProperties(data.properties);
      } else {
        setProperties(prev => [...prev, ...data.properties]);
      }
    } catch (err) {
      console.error('Error fetching property listings:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Initial data load
  useEffect(() => {
    fetchPropertyListings(1);
  }, [user?.id, fetchPropertyListings]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    fetchPropertyListings(1, true);
  }, [fetchPropertyListings]);

  // Load more data when reaching the end of the list
  const handleLoadMore = useCallback(() => {
    if (!hasMorePages || loading || refreshing) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPropertyListings(nextPage);
  }, [currentPage, hasMorePages, loading, refreshing, fetchPropertyListings]);

  // Render footer with loading indicator when fetching more data
  const renderFooter = useCallback(() => {
    if (!loading || refreshing) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.main} />
        <Text style={styles.loadingText}>Loading more properties...</Text>
      </View>
    );
  }, [loading, refreshing]);

  // Render property card
  const renderPropertyCard = useCallback(
    ({item}: {item: Property}) => <PropertyCard property={item} />,
    [],
  );

  // Extract key for FlatList
  const keyExtractor = useCallback((item: Property) => item.id.toString(), []);

  // Check if the list is empty
  const isListEmpty = !loading && properties.length === 0;

  return (
    <View style={styles.container}>
      <Header title="Property Listings" />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            isListEmpty ? (
              <EmptyListPlaceholder />
            ) : loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.main} />
                <Text style={styles.loadingText}>Loading properties...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100, // Extra padding at bottom for better UX
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#d32f2f',
    fontSize: 16,
  },
});

export default ListingsScreen;
