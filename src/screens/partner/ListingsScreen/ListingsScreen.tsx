import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  StyleSheet,
} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {Property} from './types';
import PropertyCard from './components/PropertyCard';
import SearchAndFilter from './components/SearchAndFilter';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ListingScreenStackParamList} from '../../../navigator/components/PropertyListingScreenStack';
import Header from '../../../components/Header';

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
        setError('Failed to load properties');
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
  }, [fetchProperties]);

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
      fetchProperties(1, true);
    },
    [fetchProperties],
  );

  const handleFilter = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      fetchProperties(1, true);
    },
    [fetchProperties],
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

  const renderFooter = () =>
    isLoading && properties.length > 0 ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading more properties...</Text>
      </View>
    ) : null;

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
        renderItem={({item}) => (
          <PropertyCard property={item} onPress={handlePropertyPress} />
        )}
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
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
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
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default ListingScreen;
