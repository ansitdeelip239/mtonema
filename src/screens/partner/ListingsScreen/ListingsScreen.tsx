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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ListingScreenStackParamList} from '../../../navigator/components/PropertyListingScreenStack';
// import {usePartner} from '../../../context/PartnerProvider';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<
  ListingScreenStackParamList,
  'ListingsScreen'
>;

const ListingsScreen: React.FC<Props> = ({navigation}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;
  const {user} = useAuth();
  const flatListRef = useRef<FlatList<Property>>(null);
  // const {partnerPropertyUpdated} = usePartner();

  // Just keep a single ref for current page
  const currentPageRef = useRef<number>(1);
  // Reference to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  // Track if we returned from detail screen
  const returnedFromDetailRef = useRef<boolean>(false);

  // Simplified fetch property listings
  const fetchPropertyListings = useCallback(
    async (page: number, isRefreshing: boolean = false) => {
      // Guard clause with better logging
      if (!user?.id) {
        console.log('Fetch aborted: No user ID available');
        return;
      }

      try {
        // Set loading states based on operation type
        if (isRefreshing) {
          setRefreshing(true);
        } else if (page === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        // Clear any previous errors
        setError(null);

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
          `Received ${data.properties.length} properties, hasNextPage: ${data.pagination.hasNextPage}`,
        );

        // Update pagination state
        setHasMorePages(data.pagination.hasNextPage);

        // Keep track of the current page in the ref
        currentPageRef.current = page;

        // Update properties list
        if (isRefreshing || page === 1) {
          setProperties(data.properties);
        } else {
          setProperties(prev => [...prev, ...data.properties]);
        }
      } catch (err: any) {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

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
          // Reset loading states
          if (isRefreshing) {
            setRefreshing(false);
          } else if (page === 1) {
            setInitialLoading(false);
          } else {
            setLoadingMore(false);
          }
        }
      }
    },
    [user?.id],
  );

  // Initial load effect
  useEffect(() => {
    if (user?.id) {
      console.log('Initial load: Fetching properties');
      fetchPropertyListings(1);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user?.id, fetchPropertyListings]);

  // Focus effect to handle refresh when returning from details
  useFocusEffect(
    useCallback(() => {
      // Check if we're returning from detail screen and partnerPropertyUpdated changed
      if (returnedFromDetailRef.current && user?.id) {
        console.log('Returning to screen: Refreshing properties list');
        currentPageRef.current = 1;
        fetchPropertyListings(1);
        returnedFromDetailRef.current = false;
      }

      return () => {
        // When leaving the screen, mark that we're navigating away
        returnedFromDetailRef.current = true;
      };
    }, [user?.id, fetchPropertyListings]),
  );

  // Simplified pull-to-refresh
  const handleRefresh = useCallback(() => {
    console.log('Pull-to-refresh triggered');
    currentPageRef.current = 1;
    fetchPropertyListings(1, true);
  }, [fetchPropertyListings]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    setError(null);
    fetchPropertyListings(currentPageRef.current);
  }, [fetchPropertyListings]);

  // Simplified load more function
  const handleLoadMore = useCallback(() => {
    // Don't load more if already loading or no more pages
    if (loadingMore || refreshing || initialLoading || !hasMorePages) {
      return;
    }

    const nextPage = currentPageRef.current + 1;
    console.log(`Loading more data - requesting page ${nextPage}`);
    fetchPropertyListings(nextPage);
  }, [
    hasMorePages,
    loadingMore,
    refreshing,
    initialLoading,
    fetchPropertyListings,
  ]);

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

  // Handle property card press - navigate to details
  const handlePropertyPress = useCallback(
    (property: Property) => {
      console.log(`Navigating to property details for ID: ${property.id}`);

      navigation.navigate('ListingsDetailScreen', {
        propertyId: Number(property.id),
      });
    },
    [navigation],
  );

  // Render property card with memo for better performance
  const renderPropertyCard = useCallback(
    ({item}: {item: Property}) => (
      <PropertyCard property={item} onPress={handlePropertyPress} />
    ),
    [handlePropertyPress],
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
              progressBackgroundColor="#fff"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          // Performance settings
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          disableVirtualization={false}
          automaticallyAdjustContentInsets={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
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
