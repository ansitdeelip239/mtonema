import {useState, useCallback, useEffect} from 'react';
import { PropertyFor, SortBy } from '../../../../constants/MasterDetails';
import { Property, PropertySearchParams } from '../../../../types';
import { searchProperties } from './useProperties';

export const useSearchProperties = () => {
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
    setSearchParams((prev: PropertySearchParams) => ({...prev, page: 1, sortBy: sortBy as PropertySearchParams['sortBy']}));
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

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const handlePropertyPress = (propertyId: string) => {
    // Find the property by ID and show modal
    const property = allProperties.find(p => p.propertyId.toString() === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowPropertyModal(true);
    }
  };

  const handleClosePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setAllProperties([]);
    const refreshParams = {
      ...searchParams,
      page: 1,
      propertyFor: propertyForFilter === 'all' ? undefined : propertyForFilter,
    };
    setSearchParams((prev: PropertySearchParams) => ({...prev, page: 1}));

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

  const setPropertyForFilterAndResetPage = useCallback((filter: typeof propertyForFilter) => {
    setPropertyForFilter(filter);
    setSearchParams((prev: PropertySearchParams) => ({...prev, page: 1}));
  }, []);

  return {
    showFilters,
    setShowFilters,
    showSortModal,
    setShowSortModal,
    propertyForFilter,
    setPropertyForFilter,
    setPropertyForFilterAndResetPage,
    refreshing,
    allProperties,
    isLoading,
    totalCount,
    searchParams,
    currentFilters,
    handleSearchWithLoading,
    applyFilters,
    clearFilters,
    handleSortPress,
    handleSortSelect,
    getSortDisplayText,
    handlePropertyPress,
    handleRefresh,
    handleLoadMore,
    isLoadingMore,
    selectedProperty,
    showPropertyModal,
    handleClosePropertyModal,
  };
};
