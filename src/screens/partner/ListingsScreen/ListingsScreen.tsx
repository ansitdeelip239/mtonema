import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../components/Header';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {PropertiesResponse, Property} from './types';
import Colors from '../../../constants/Colors';
import PropertyCard from './components/PropertyCard';
import EmptyListPlaceholder from './components/EmptyListPlaceholder';

const ListingsScreen = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;
  const {user} = useAuth();
  const flatListRef = useRef<FlatList<Property>>(null);

  // Use a ref to track loading state to prevent duplicate requests
  const isLoadingRef = useRef<boolean>(false);
  // Use a ref to track the current page to avoid stale closures
  const currentPageRef = useRef<number>(1);
  // Reference to track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  // Fetch property listings
  const fetchPropertyListings = useCallback(
    async (page: number, refresh: boolean = false) => {
      if (!user?.id || isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setError(null);

        if (refresh) {
          setRefreshing(true);
        } else if (page === 1) {
          setInitialLoading(true);
        } else {
          // Loading more - only set loading more flag
          setLoadingMore(true);
        }

        console.log(`Fetching page ${page} properties for user ${user.id}`);

        const response = await PartnerService.getPartnerPropertyByUserId(
          user.id,
          page,
          pageSize,
        );

        // Prevent state updates if component unmounted during the API call
        if (!isMountedRef.current) {
          return;
        }

        const data = response.data as PropertiesResponse;
        console.log(
          `Received ${data.properties.length} properties, hasNextPage: ${data.pagination.hasNextPage}, ` +
            `totalPages: ${data.pagination.totalPages}, currentPage: ${data.pagination.currentPage}`,
        );

        // Update pagination state
        setHasMorePages(data.pagination.hasNextPage);

        // Keep track of the current page in the ref
        currentPageRef.current = page;

        // Update properties list
        if (refresh || page === 1) {
          setProperties(data.properties);
        } else {
          setProperties(prev => [...prev, ...data.properties]);
        }
      } catch (err: any) {
        // Explicitly type error as any since it could be various types
        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        console.error('Error fetching property listings:', err);

        // More specific error message based on network status
        const isNetworkError =
          err.message?.includes('Network') ||
          err.message?.includes('network') ||
          err.message?.includes('connection');

        if (isNetworkError) {
          setError(
            'Network connection issue. Please check your internet connection and try again.',
          );
        } else {
          setError('Failed to load properties. Please try again later.');
        }
      } finally {
        // Only update state if the component is still mounted
        if (isMountedRef.current) {
          setInitialLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
          isLoadingRef.current = false;
        }
      }
    },
    [user?.id],
  );

  // Initial data load
  useEffect(() => {
    if (user?.id) {
      console.log('Initial data load triggered');
      fetchPropertyListings(1);
    }

    // Cleanup function when component unmounts
    return () => {
      isMountedRef.current = false;
    };
  }, [user?.id, fetchPropertyListings]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    console.log('Pull-to-refresh triggered');
    currentPageRef.current = 1;
    fetchPropertyListings(1, true);
  }, [fetchPropertyListings]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    fetchPropertyListings(currentPageRef.current);
  }, [fetchPropertyListings]);

  // Load more data when reaching the end of the list
  const handleLoadMore = useCallback(() => {
    // Only proceed if we're not already loading and there are more pages
    if (isLoadingRef.current || !hasMorePages || refreshing || initialLoading) {
      console.log(
        'Skipping load more request - already loading or no more pages',
      );
      return;
    }

    const nextPage = currentPageRef.current + 1;
    console.log(`Loading more data - requesting page ${nextPage}`);
    fetchPropertyListings(nextPage);
  }, [hasMorePages, refreshing, initialLoading, fetchPropertyListings]);

  // Render footer with loading indicator when fetching more data
  const renderFooter = useCallback(() => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.main} />
        <Text style={styles.loadingText}>Loading more properties...</Text>
      </View>
    );
  }, [loadingMore]);

  // Render property card with memo for better performance
  const renderPropertyCard = useCallback(
    ({item}: {item: Property}) => <PropertyCard property={item} />,
    [],
  );

  // Extract key for FlatList
  const keyExtractor = useCallback((item: Property) => item.id.toString(), []);

  // Check if the list is empty
  const isListEmpty = !initialLoading && properties.length === 0;

  // Add getItemLayout function to provide fixed height information
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: 160, // CARD_HEIGHT value
      offset: 160 * index + (index > 0 ? 16 * index : 0), // Account for marginBottom in card style
      index,
    }),
    [],
  );

  // Clear property list function
  // const clearPropertyList = () => {
  //   // Clear the list
  //   setProperties([]);

  //   // Optional: Reset the animation tracking if you want animations to play again
  //   // This requires making animatedPropertyIds exportable from PropertyCard.tsx
  //   // import { resetAnimatedProperties } from './components/PropertyCard';
  //   // resetAnimatedProperties();
  // }

  return (
    <View style={styles.container}>
      <Header title="Property Listings" />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.7}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Update your FlatList with these optimized props
        <FlatList
          ref={flatListRef}
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentContainerStyle={[
            styles.listContainer,
            isListEmpty && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.main]}
              tintColor={Colors.main}
            />
          }
          // Enable onEndReached but don't use InteractionManager
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Increase this value
          ListFooterComponent={renderFooter}
          // Critical performance settings
          removeClippedSubviews={true}
          maxToRenderPerBatch={10} // Increase from 3 to reduce flashing
          updateCellsBatchingPeriod={50} // Reduce to update more frequently
          initialNumToRender={10} // Increase for smoother initial render
          windowSize={10} // Increase to keep more items in memory
          // Keep these optimization props
          disableVirtualization={false}
          automaticallyAdjustContentInsets={false}
          // Optional - may help with flickering
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          // Other props remain the same
          ListEmptyComponent={
            isListEmpty ? (
              <EmptyListPlaceholder />
            ) : initialLoading ? (
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

// Enhanced styles with retry button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100, // Extra padding at bottom for better UX
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ListingsScreen;
