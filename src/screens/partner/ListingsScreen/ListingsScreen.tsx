import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {Property} from './types';
import PropertyCard from './components/PropertyCard';
import SearchAndFilter from './components/SearchAndFilter';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ListingScreenStackParamList} from '../../../navigator/components/PropertyListingScreenStack';
import Header from '../../../components/Header';
import { usePartner } from '../../../context/PartnerProvider';
import { Swipeable } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';

const PAGE_SIZE = 10;

type Props = NativeStackScreenProps<
  ListingScreenStackParamList,
  'ListingsScreen'
>;

const ListingScreen: React.FC<Props> = ({navigation}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const {partnerPropertyUpdated} = usePartner();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyFor: null as string | null,
    status: null as string | null,
    city: null as string | null,
  });

  const {user} = useAuth();
  const isMountedRef = useRef(true);

  const fetchProperties = useCallback(
    async (page: number, shouldRefresh = false) => {
      if (!user?.id) {
        return;
      }
      try {
        if (shouldRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const response = await PartnerService.getPartnerPropertyByUserId(
          user.id,
          page,
          PAGE_SIZE,
          searchQuery || undefined,
          filters.propertyFor || undefined,
          filters.status || undefined,
          filters.city || undefined,
        );

        const data = response.data;
        const newProperties = data.properties ?? [];

        if (shouldRefresh) {
          setProperties(newProperties);
        } else {
          setProperties(prev => [...prev, ...newProperties]);
        }

        setHasMoreData(data.pagination?.hasNextPage ?? false);
        setCurrentPage(data.pagination?.currentPage ?? 1);
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch properties');
      } finally {
        if (shouldRefresh) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [user?.id, searchQuery, filters],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchProperties(1, true);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProperties, partnerPropertyUpdated]);

  useEffect(() => {
    fetchProperties(1, true);
  }, [filters, searchQuery, fetchProperties]);

  const handleRefresh = useCallback(() => {
    fetchProperties(1, true);
  }, [fetchProperties]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !isLoading && !isRefreshing) {
      fetchProperties(currentPage + 1);
    }
  }, [hasMoreData, isLoading, isRefreshing, fetchProperties, currentPage]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [],
  );

  const handleFilter = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
    },
    [],
  );

  const handlePropertyPress = useCallback(
    (property: Property) => {
      console.log(`Navigating to property details for ID: ${property.id}`);

      navigation.navigate('ListingsDetailScreen', {
        propertyId: Number(property.id),
      });
    },
    [navigation],
  );

  // Delete property handler
  const handleDeleteProperty = useCallback(
    async (propertyId: number) => {
      try {
        // await PartnerService.deletePartnerProperty(propertyId);
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        ToastAndroid.show('Property deleted', ToastAndroid.SHORT);
      } catch (err) {
        ToastAndroid.show('Failed to delete property', ToastAndroid.LONG);
      }
    },
    [],
  );

  // Render left action for swipe (Edit)
  const renderLeftActions = (propertyId: number) => (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => {
        console.log(`Navigating to edit property for ID: ${propertyId}`);
      }}
    >
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  );

  // Render right action for swipe (Delete)
  const renderRightActions = (propertyId: number) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteProperty(propertyId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  // Update renderItem to use Swipeable with both left and right actions
  const renderItem = ({item}: {item: Property}) => (
    <Swipeable
      renderLeftActions={() => renderLeftActions(item.id)}
      renderRightActions={() => renderRightActions(item.id)}
    >
      <PropertyCard property={item} onPress={handlePropertyPress} />
    </Swipeable>
  );

  const renderFooter = () =>
    isLoading && properties.length > 0 ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading more properties...</Text>
      </View>
    ) : null;

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Header title="Property Listings" />
      <SearchAndFilter
        initialFilters={filters}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
      <FlatList
        data={properties}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Text>No properties found.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    paddingTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#ffeaea',
    borderRadius: 6,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  editButton: {
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '91%',
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '91%',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListingScreen;
