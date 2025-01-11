import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Image,
} from 'react-native';
import { api } from '../../utils/api';
import url from '../../constants/api';
import { PropertyModel } from '../../types';
import PropertyModal from './PropertyModal';

const RecommendedProperty = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isLoadingRef = useRef(false);

  const pageSize = 10;

  const getAllProperty = useCallback(
    async (page: number, isRefreshing: boolean = false) => {
      if (isLoadingRef.current && !isRefreshing) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setIsFetchingMore(true); // Set fetching more to true
        const response = await api.get<any>(
          `${url.RecommendedProperty}?pageNumber=${page}&pageSize=${pageSize}`,
        );

        const newProperties = response.data?.propertyModels || [];
        // const totalCount=response.data.

        setProperties(prevProperties => {
          if (page === 1 || isRefreshing) {
            return newProperties;
          }

          const existingIds = new Set(prevProperties.map(p => p.ID));
          const uniqueNewProperties = newProperties.filter(
            (p: PropertyModel) => !existingIds.has(p.ID),
          );

          const hasNewData = uniqueNewProperties.length > 0;
          setHasMore(hasNewData && newProperties.length === pageSize);

          return hasNewData
            ? [...prevProperties, ...uniqueNewProperties]
            : prevProperties;
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch properties');
        setHasMore(false);
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
        setIsFetchingMore(false); // Reset fetching more to false
        setRefreshing(false);
      }
    },
    [pageSize],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPageNo(1);
    getAllProperty(1, true);
  }, [getAllProperty]);

  const handlePropertyPress = (property: PropertyModel) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  const loadMore = useCallback(() => {
    const debouncedLoadMore = debounce(() => {
      if (hasMore && !isLoadingRef.current) {
        setPageNo(prev => prev + 1);
      }
    }, 300);
    debouncedLoadMore();
  }, [hasMore]);

  useEffect(() => {
    getAllProperty(pageNo);
  }, [pageNo, getAllProperty]);

  const renderPropertyItem = ({ item }: { item: PropertyModel }) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.propertyCard}>
        {/* Property Image */}
        {item.ImageURL && item.ImageURL.length > 0 && (
          <Image
            source={{ uri: item.ImageURL[0].ImageUrl }} // Dynamically load the first image
            style={styles.propertyImage}
            resizeMode="cover"
          />
        )}

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.locationText}>
            {item.Location || item.City?.MasterDetailName || 'Location not specified'}
          </Text>
          <Text style={styles.propertyType}>
            {item.PropertyType?.MasterDetailName} for {item.PropertyFor?.MasterDetailName}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.price}>
              ₹{item.Price} {item.Rate?.MasterDetailName}
            </Text>
            <Text style={styles.area}>
              {item.Area} {item.Size?.MasterDetailName}
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
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>Listed by: {item.SellerName}</Text>
            <Text style={styles.sellerPhone}>Contact: {item.SellerPhone}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0066cc']}
            tintColor="#0066cc"
          />
        }
        ListFooterComponent={
          isFetchingMore ? ( // Show loader only when fetching more data
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
    borderRadius: 12, // Rounded corners
    marginBottom: 15,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden', // Ensure the image corners are rounded
  },
  propertyImage: {
    width: '100%',
    height: 200, // Fixed height for the image
  },
  detailsContainer: {
    padding: 15,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  propertyType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    marginBottom: 5,
  },
  sellerDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sellerName: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 3,
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

export default RecommendedProperty;

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
