import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../../types/navigation';
import {useDrawer} from '../../../hooks/useDrawer';
import {Property, PropertySearchParams} from '../../../types';
import {
  PropertyCard,
  FilterModal,
  PropertyTypeToggle,
  SortModal,
} from './components';
import {searchPropertiesStyles as styles} from './styles';
import {searchProperties} from './hooks/useProperties';
import {PropertyFor, SortBy} from '../../../constants/MasterDetails';
import Colors from '../../../constants/Colors';
import SearchHeader from './components/SearchHeader';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Search Property'>;

const EmptyComponent = ({isLoading}: {isLoading: boolean}) => {
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingEmptyText}>Loading properties...</Text>
      </View>
    );
  }
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No properties found</Text>
    </View>
  );
};

const FooterComponent = () => <View style={styles.bottomSpacing} />;

const Separator = () => <View style={styles.separator} />;

const LoadingFooter = () => (
  <View style={styles.loadingFooter}>
    <ActivityIndicator size="small" color={Colors.primary} />
    <Text style={styles.loadingMoreText}>Loading more properties...</Text>
  </View>
);

const SearchPropertiesScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {openDrawer} = useDrawer();

  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [propertyForFilter, setPropertyForFilter] = useState<
    | typeof PropertyFor.SALE
    | typeof PropertyFor.RENT
    | typeof PropertyFor.OTHERS
    | 'all'
  >(PropertyFor.SALE);
  const [refreshing, setRefreshing] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    pageSize: 12,
    propertyFor: PropertyFor.SALE,
    sortBy: SortBy.NEWEST,
  });
  const [currentFilters, setCurrentFilters] = useState<
    Partial<PropertySearchParams>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  // Function to fetch properties
  const fetchProperties = useCallback(
    async (params: PropertySearchParams, isLoadMore = false) => {
      try {
        if (!isLoadMore) {
          setIsLoading(true);
          // Reset properties for new search/filter
          setAllProperties([]);
          setTotalCount(0);
        }

        console.log('Fetching properties with params:', params);
        const response = await searchProperties(params);

        if (response) {
          const properties = response.properties || [];
          setTotalCount(response.total || 0);

          if (isLoadMore) {
            // Append for pagination
            setAllProperties(prev => [...prev, ...properties]);
          } else {
            // Replace for new search/filter
            setAllProperties(properties);
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        if (!isLoadMore) {
          setAllProperties([]);
          setTotalCount(0);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // Handle search with loading state
  const handleSearchWithLoading = useCallback(
    (text: string) => {
      const updatedParams = {
        ...searchParams,
        page: 1,
        location: text.trim() || undefined,
      };

      setSearchParams(updatedParams);
    },
    [searchParams],
  );
  // Initial load and when search params change (exclude pagination)
  useEffect(() => {
    const finalParams = {
      ...searchParams,
      propertyFor: propertyForFilter === 'all' ? undefined : propertyForFilter,
    };

    fetchProperties(finalParams, false);
    setCurrentPage(1); // Reset page when search params change
  }, [searchParams, propertyForFilter, fetchProperties]);

  // Handle property filter change
  const applyFilters = useCallback(
    (filters: Partial<PropertySearchParams>) => {
      setShowFilters(false);
      setCurrentFilters(filters);
      // Update search params with filters
      const updatedParams = {
        ...searchParams,
        ...filters,
        page: 1,
      };
      setSearchParams(updatedParams);
    },
    [searchParams],
  );

  const clearFilters = useCallback(() => {
    setCurrentFilters({});
    // Clear all filters from search params
    const clearedParams = {
      ...searchParams,
      propertyTypes: undefined,
      bhkType: undefined,
      furnishing: undefined,
      city: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      page: 1,
    };
    setSearchParams(clearedParams);
  }, [searchParams]);

  const handleSortPress = useCallback(() => {
    setShowSortModal(true);
  }, []);

  const handleSortSelect = (sortBy: string) => {
    setAllProperties([]);
    setTotalCount(0); // Reset total count to prevent unwanted pagination
    setSearchParams(prev => ({...prev, page: 1, sortBy: sortBy as any}));
  };

  const getSortDisplayText = useCallback((sortBy: string) => {
    switch (sortBy) {
      case SortBy.NEWEST:
        return 'Newest';
      case SortBy.PRICE_LOW_TO_HIGH:
        return 'Price: Low to High';
      case SortBy.PRICE_HIGH_TO_LOW:
        return 'Price: High to Low';
      case SortBy.AREA_LOW_TO_HIGH:
        return 'Area: Low to High';
      case SortBy.AREA_HIGH_TO_LOW:
        return 'Area: High to Low';
      default:
        return 'Sort';
    }
  }, []);

  const handlePropertyPress = (propertyId: string) => {
    // Navigate to property details
    console.log('Navigate to property:', propertyId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setAllProperties([]);
    const refreshParams = {
      ...searchParams,
      page: 1,
      propertyFor: propertyForFilter === 'all' ? undefined : propertyForFilter,
    };
    setSearchParams(prev => ({...prev, page: 1}));

    try {
      await fetchProperties(refreshParams, false);
    } catch (refreshError) {
      console.error('Error refreshing properties:', refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && allProperties.length < totalCount) {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const loadMoreParams = {
        ...searchParams,
        page: nextPage,
        propertyFor:
          propertyForFilter === 'all' ? undefined : propertyForFilter,
      };

      // Directly call fetchProperties for pagination
      fetchProperties(loadMoreParams, true).finally(() => {
        setCurrentPage(nextPage);
      });
    }
  }, [
    isLoading,
    isLoadingMore,
    allProperties.length,
    totalCount,
    searchParams,
    propertyForFilter,
    fetchProperties,
    currentPage,
  ]);

  const renderFooter = () => {
    if (isLoadingMore) {
      return <LoadingFooter />;
    }
    return <FooterComponent />;
  };

  const renderHeader = useMemo(() => {
    return (
      <View>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
              <GetIcon iconName="hamburgerMenu" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Find Your</Text>
            <Text style={styles.headerTitle}>Dream Property</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <GetIcon iconName="settings" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchHeader
          placeholder="Search properties..."
          onSearch={handleSearchWithLoading}
          onFilterPress={() => setShowFilters(true)}
        />

        {/* Property Type Toggle */}
        <PropertyTypeToggle
          propertyForFilter={propertyForFilter}
          onFilterChange={filter => {
            setPropertyForFilter(filter);
            setSearchParams(prev => ({...prev, page: 1}));
          }}
        />

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading || refreshing
              ? 'Loading...'
              : `${totalCount} Properties`}
          </Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <Text style={styles.sortButtonText}>
              {getSortDisplayText(searchParams.sortBy || SortBy.NEWEST)}
            </Text>
            <GetIcon iconName="filterFunnel" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    openDrawer,
    propertyForFilter,
    isLoading,
    refreshing,
    totalCount,
    searchParams.sortBy,
    handleSortPress,
    getSortDisplayText,
    handleSearchWithLoading,
  ]);

  const renderPropertyItem: ListRenderItem<Property> = ({item}) => (
    <View style={styles.propertyCardContainer}>
      <PropertyCard property={item} onPress={handlePropertyPress} />
    </View>
  );

  const renderEmptyComponent = useMemo(() => {
    return <EmptyComponent isLoading={isLoading} />;
  }, [isLoading]);

  return (
    <>
      <FlatList
        data={allProperties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.propertyId.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        currentFilters={currentFilters}
      />
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSelectSort={handleSortSelect}
        currentSort={searchParams.sortBy || SortBy.NEWEST}
      />
    </>
  );
};

export default SearchPropertiesScreen;
