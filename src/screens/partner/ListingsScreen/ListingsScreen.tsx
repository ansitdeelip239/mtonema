import React, {useCallback, useEffect, useState, useRef} from 'react';
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
import {usePartner} from '../../../context/PartnerProvider';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {TouchableOpacity} from 'react-native';
import ConfirmationModal from '../../../components/ConfirmationModal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const {partnerPropertyUpdated} = usePartner();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyFor: null as string | null,
    status: null as string | null,
    city: null as string | null,
  });

  const {user} = useAuth();

  const swipeableRefs = useRef<Map<number, Swipeable>>(new Map());

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
          debouncedSearchQuery || undefined, // <-- use debounced value here
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
    [user?.id, debouncedSearchQuery, filters], // <-- use debouncedSearchQuery here
  );

  useEffect(() => {
    // When filters, search, or partnerPropertyUpdated change,
    // always treat it like a refresh from the start.
    setProperties([]);
    setCurrentPage(1);
    setHasMoreData(true);
    fetchProperties(1, true);
  }, [filters, debouncedSearchQuery, partnerPropertyUpdated, fetchProperties]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleRefresh = useCallback(() => {
    setProperties([]);
    setCurrentPage(1);
    setHasMoreData(true);
    fetchProperties(1, true);
  }, [fetchProperties]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !isLoading && !isRefreshing) {
      fetchProperties(currentPage + 1);
    }
  }, [hasMoreData, isLoading, isRefreshing, fetchProperties, currentPage]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleFilter = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handlePropertyPress = useCallback(
    (property: Property) => {
      console.log(`Navigating to property details for ID: ${property.id}`);

      navigation.navigate('ListingsDetailScreen', {
        propertyId: Number(property.id),
      });
    },
    [navigation],
  );

  // Delete property handler (now only deletes after confirmation)
  const handleDeleteProperty = useCallback(async () => {
    if (deletingId == null) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await PartnerService.deletePartnerProperty(deletingId);
      if (response.success) {
        setProperties(prev => prev.filter(p => p.id !== deletingId));
        ToastAndroid.show('Property deleted', ToastAndroid.SHORT);
      }
    } catch (err) {
      ToastAndroid.show('Failed to delete property', ToastAndroid.LONG);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  }, [deletingId]);

  // Render left action for swipe (Edit)
  const renderLeftActions = (propertyItem: Property) => (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => {
        console.log(`Navigating to edit property for ID: ${propertyItem.id}`);
        swipeableRefs.current.get(propertyItem.id)?.close();
        navigation.navigate('EditPartnerProperty', {
          propertyData: propertyItem,
        });
      }}>
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  );

  // Render right action for swipe (Delete)
  const renderRightActions = (propertyId: number) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        swipeableRefs.current.get(propertyId)?.close();
        setDeletingId(propertyId);
        setShowDeleteModal(true);
      }}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  // Update renderItem to use Swipeable with both left and right actions
  const renderItem = ({item}: {item: Property}) => (
    <Swipeable
      ref={(ref: Swipeable) => {
        if (ref) {
          swipeableRefs.current.set(item.id, ref);
        } else {
          swipeableRefs.current.delete(item.id);
        }
      }}
      renderLeftActions={() => renderLeftActions(item)}
      renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.propertyCardContainer}>
        <PropertyCard property={item} onPress={handlePropertyPress} />
      </View>
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
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Property"
        message="Are you sure you want to delete this property?"
        onConfirm={handleDeleteProperty}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        isLoading={isDeleting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  propertyCardContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    // paddingHorizontal: 16,
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
    marginLeft: 16,
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
    marginRight: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListingScreen;
