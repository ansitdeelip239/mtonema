import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {PropertyModel} from '../../types';
import PropertyModal from '../buyer/PropertyModal';
import {useAuth} from '../../hooks/useAuth';

const PropertyListScreen = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const isLoadingRef = useRef(false);
  const {user, dataUpdated} = useAuth();

  const pageSize = 10;

  const getAllProperty = useCallback(
    async (page: number) => {
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        console.log(`Fetching page ${page}`);

        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          setIsFetchingMore(false);
          return;
        }

        const response = await api.get<any>(
          `${url.GetProperty}?id=${user.ID}&pageNumber=${page}&pageSize=${pageSize}`,
        );

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        const newProperties = response.data.propertyModels ?? [];
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
        setRefreshing(false); // Stop refreshing after fetching data
      }
    },
    [pageSize, user],
  );

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    setPageNo(1); // Reset to the first page
    setProperties([]); // Clear existing data
    getAllProperty(1); // Fetch fresh data
  }, [getAllProperty]);

  const handlePropertyPress = (property: PropertyModel) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

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
    getAllProperty(1);
  }, [getAllProperty, dataUpdated]);

  const renderPropertyItem = ({item}: {item: PropertyModel}) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.propertyCard}>
        {/* Property Image */}
        {item.ImageURL && item.ImageURL.length > 0 && (
          <Image
            source={{uri: item.ImageURL[0].ImageUrl}}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        )}

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          {/* Location and Property Type */}
          <Text style={styles.locationText}>
            {item.Location ||
              item.City?.MasterDetailName ||
              'Location not specified'}
          </Text>
          <Text style={styles.propertyType}>
            {item.PropertyType?.MasterDetailName} for{' '}
            {item.PropertyFor?.MasterDetailName}
          </Text>

          {/* Price and Area */}
          <View style={styles.detailsRow}>
            <Text style={styles.price}>
              Amount: ₹{item.Price} {item.Rate?.MasterDetailName}
            </Text>
            <Text style={styles.area}>
              Area: {item.Area} {item.Size?.MasterDetailName}
            </Text>
          </View>

          {/* Additional Details */}
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

          {/* Seller Details and Enquiry Button */}
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={properties}
        keyExtractor={item => `property-${item.ID}`}
        renderItem={renderPropertyItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={ // Add RefreshControl
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0066cc']} // Customize the loading spinner color
            tintColor="#0066cc" // Customize the loading spinner color (iOS)
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
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>No properties available</Text>
          </View>
        }
      />
      <PropertyModal
        property={selectedProperty}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
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
});

export default PropertyListScreen;

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
