import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { api } from '../../utils/api';
import url from '../../constants/api';
import { PropertyModel } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import PropertyModal from './PropertyModal';

const EmptyComponent = () => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.noDataText}>No properties available</Text>
    </View>
  );
};

const ContactedProperty = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { user, dataUpdated } = useAuth();
  const pageSize = 10;
  const [selectedProperty, setSelectedProperty] = useState<PropertyModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Reset pagination when user changes
  useEffect(() => {
    setPageNo(1);
    setProperties([]);
    setHasMore(true);
  }, [user?.ID]);

  const handlePropertyPress = (property: PropertyModel) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  const getcontactedProperty = useCallback(
    async (pageNumber: number, pageSizes: number) => {
      if (isFetchingMore) {
        return;
      }
      try {
        if (pageNumber === 1) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        const requestBody = {
          Address: '',
          BhkType: '',
          City: '',
          FurnishType: '',
          MaxPrice: 0,
          MinPrice: 0,
          Place: null,
          Price: '',
          PropertyFor: null,
          PropertyType: null,
          Relevance: '',
          SellerType: '',
          ZipCode: '',
          pageNumber: pageNumber,
          pageSize: pageSizes,
        };

        // Check if user exists
        if (!user?.ID) {
          throw new Error('User ID is required');
        }

        // Make the API call
        const response = await api.post<any>(
          `${url.getListOfContactedProperty}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${user.ID}`,
          requestBody,
        );

        // Log the full response for debugging
        console.log('API Response:', JSON.stringify(response, null, 2));

        // Handle the response
        const responseData = response?.data;

        if (!responseData) {
          throw new Error('No data received from server');
        }

        if (responseData?.contactedPropertyModels) {
          const newProperties = responseData.contactedPropertyModels;

          // Update properties state based on page number
          setProperties(prevProperties =>
            pageNumber === 1 ? newProperties : [...prevProperties, ...newProperties],
          );

          // Update hasMore state
          setHasMore(newProperties.length >= pageSize);
        } else {
          // If no properties found, set hasMore to false
          setHasMore(false);
          if (pageNumber === 1) {
            setProperties([]);
          }
        }
      } catch (err) {
        console.error('Error details:', (err as Error).message);
        setError((err as Error).message || 'Failed to fetch properties');
        setHasMore(false);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [isFetchingMore, user?.ID, pageSize],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Fetch new data and update state
    getcontactedProperty(1, pageSize).then(() => {
      setRefreshing(false);
    });
  }, [getcontactedProperty, pageSize]);

  // Fetch properties when page changes
  useEffect(() => {
    if (user?.ID) {
      getcontactedProperty(pageNo, pageSize);
    }
  }, [pageNo, user?.ID, isFetchingMore, dataUpdated, getcontactedProperty]);

  const loadMore = () => {
    if (hasMore && !isFetchingMore && !loading) {
      setPageNo(prev => prev + 1);
    }
  };

  const renderPropertyItem = ({ item }: { item: PropertyModel }) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.propertyCard}>
        {/* Display the first image if available */}
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
    <>
      <FlatList
        style={styles.container}
        data={properties}
        keyExtractor={item => item.ID?.toString() || Math.random().toString()}
        renderItem={renderPropertyItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#0066cc" />
            </View>
          ) : null
        }
        ListEmptyComponent={<EmptyComponent />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <PropertyModal
        property={selectedProperty}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
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
    borderRadius: 8,
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
  propertyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
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

export default ContactedProperty;
