import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  SafeAreaView,
} from 'react-native';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {PropertyModel} from '../../types';
import PropertyModal from './PropertyModal';

const BuyerHomeScreen = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
        const response = await api.get<any>(
          `${url.RecommendedProperty}?pageNumber=${page}&pageSize=${pageSize}`,
        );

        const newProperties = response.data?.propertyModels || [];

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
        setIsFetchingMore(false);
        setRefreshing(false);
      }
    },
    [pageSize],
  );

  // Handle search
  useEffect(() => {
    const filtered = properties.filter(property =>
      property.Location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.PropertyType?.MasterDetailName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.City?.MasterDetailName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

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
      if (hasMore && !isLoadingRef.current && searchQuery.length === 0) {
        setPageNo(prev => prev + 1);
      }
    }, 300);
    debouncedLoadMore();
  }, [hasMore, searchQuery]);

  useEffect(() => {
    getAllProperty(pageNo);
  }, [pageNo, getAllProperty]);

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search properties..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPropertyItem = ({item}: {item: PropertyModel}) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.propertyCard}>
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
      {renderHeader()}
      <FlatList
        data={searchQuery ? filteredProperties : properties}
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
          isFetchingMore && !searchQuery ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#0066cc" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>
              {searchQuery ? 'No matching properties found' : 'No properties available'}
            </Text>
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
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

export default BuyerHomeScreen;
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
