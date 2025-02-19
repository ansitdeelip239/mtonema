import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {PropertyModel} from '../types';
import {formatCurrency} from '../utils/currency';

interface PropertyListProps {
  fetchProperties: (page: number) => Promise<any>;
  onPropertyPress: (property: PropertyModel) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  dataUpdated?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({
  fetchProperties,
  onPropertyPress,
  ListHeaderComponent,
  dataUpdated = false,
}) => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isLoadingRef = useRef(false);
  const pageSize = 10;

  const getAllProperty = useCallback(
    async (page: number) => {
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        console.log(`Fetching page ${page}`);

        const response = await fetchProperties(page);

        console.log('API Response:', response);

        if (!response) {
          throw new Error('No response from server');
        }

        if (response.success === false) {
          console.log('No data found:', response.message);
          setProperties([]);
          setHasMore(false);
          setError(null);
          return;
        }

        const newProperties = response.data?.propertyModels ?? [];

        console.log(`Received ${newProperties.length} properties`);

        setProperties(prevProperties => {
          if (page === 1) {
            return newProperties;
          }

          const existingIds = new Set(prevProperties.map(p => p.ID));
          const uniqueNewProperties = newProperties.filter(
            (p: PropertyModel) => !existingIds.has(p.ID),
          );

          console.log(
            `Found ${uniqueNewProperties.length} unique new properties`,
          );

          const hasNewData = uniqueNewProperties.length > 0;
          setHasMore(hasNewData && newProperties.length === pageSize);

          return hasNewData
            ? [...prevProperties, ...uniqueNewProperties]
            : prevProperties;
        });
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to fetch properties');
        setHasMore(false);
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
        setIsFetchingMore(false);
        setRefreshing(false);
      }
    },
    [fetchProperties, pageSize],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPageNo(1);
    getAllProperty(1);
  }, [getAllProperty]);

  const loadMore = useCallback(() => {
    const debouncedLoadMore = debounce(() => {
      console.log('LoadMore triggered', {
        hasMore,
        isLoadingRef: isLoadingRef.current,
      });
      if (hasMore && !isLoadingRef.current) {
        setPageNo(prev => prev + 1);
      }
    }, 300);
    debouncedLoadMore();
  }, [hasMore]);

  useEffect(() => {
    console.log('Page changed to:', pageNo);
    getAllProperty(pageNo);
  }, [pageNo, getAllProperty]);

  useEffect(() => {
    if (dataUpdated) {
      handleRefresh();
    }
  }, [dataUpdated, handleRefresh]);

  const renderPropertyItem = ({item}: {item: PropertyModel}) => (
    <TouchableOpacity onPress={() => onPropertyPress(item)}>
      <View style={styles.propertyCard}>
        {item.ImageURL && item.ImageURL.length > 0 && (
          <Image
            source={{uri: item.ImageURL[0].ImageUrl}}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.locationText}>
            {item.Location ||
              item.City?.MasterDetailName ||
              'Location not specified'}
          </Text>
          <Text style={styles.propertyType}>
            {item.PropertyType?.MasterDetailName} for{' '}
            {item.PropertyFor?.MasterDetailName}
          </Text>

          <View style={styles.detailsRow}>
            <Text style={styles.price}>
              Amount: {formatCurrency(item.Price.toString())}
            </Text>
            <Text style={styles.area}>
              Area: {item.Area} {item.Size?.MasterDetailName}
            </Text>
          </View>

          <View style={styles.additionalDetails}>
            {item.Furnishing && (
              <Text style={styles.detailText}>
                Furnishing: {item.Furnishing.MasterDetailName}
              </Text>
            )}
            <Text style={styles.detailText}>
              Ready to Move: {item.readyToMove || 'Not specified'}
            </Text>
          </View>

          <View style={styles.sellerEnquiryRow}>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>
                Listed by: {item.SellerName}
              </Text>
              <Text style={styles.sellerPhone}>
                Contact: {item.SellerPhone}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && pageNo === 1) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error && properties.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      keyExtractor={item => `property-${item.ID}`}
      renderItem={renderPropertyItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#0066cc']}
          tintColor="#0066cc"
        />
      }
      ListFooterComponent={
        isFetchingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#0066cc" />
          </View>
        ) : null
      }
      ListEmptyComponent={
        refreshing ? null : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>No listed Properties</Text>
          </View>
        )
      }
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
    zIndex: 1,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 15,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propertyType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'column',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  area: {
    fontSize: 16,
    color: '#4a5568',
  },
  additionalDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  sellerEnquiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sellerDetails: {
    flex: 1,
    marginRight: 10,
  },
  sellerName: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
  sellerPhone: {
    fontSize: 14,
    color: '#2c5282',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
});

export default PropertyList;

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}
