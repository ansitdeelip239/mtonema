import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../../types/navigation';
import {useDrawer} from '../../../hooks/useDrawer';
import {Property, PropertySearchParams} from '../../../types';
import { PropertyCard, FilterModal, PropertyTypeToggle, SearchBar } from './components';
import {searchPropertiesStyles as styles} from './styles';
import { useSearchProperties } from './hooks/useProperties';
import { PropertyFor } from '../../../constants/MasterDetails';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Search Property'>;

const SearchPropertiesScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {openDrawer} = useDrawer();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [propertyForFilter, setPropertyForFilter] = useState<typeof PropertyFor.SALE | typeof PropertyFor.RENT | typeof PropertyFor.OTHERS | 'all'>(PropertyFor.SALE);
  const [searchParams, _setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    pageSize: 12,
    propertyFor: PropertyFor.SALE,
    sortBy: 'Newest',
  });

  // Dynamic search params based on filter
  const dynamicSearchParams = {
    ...searchParams,
    propertyFor: propertyForFilter === 'all' ? undefined : propertyForFilter,
  };

  const {data: searchData, isLoading, error, refetch} = useSearchProperties(dynamicSearchParams);

  const properties = searchData?.properties || [];
  const totalCount = searchData?.total || 0;

  // Filter properties based on propertyFor
  const filteredResults = properties.filter((property: Property) => {
    if (propertyForFilter === 'all') {
      return true;
    }
    return property.propertyFor === propertyForFilter;
  });

  const applyFilters = () => {
    setShowFilters(false);
    // TODO: Implement filter logic with searchParams
    console.log('Applying filters - TODO: implement');
  };

  const clearFilters = () => {
    // TODO: Reset filters
    console.log('Clearing filters - TODO: implement');
  };

  const handlePropertyPress = (propertyId: string) => {
    // Navigate to property details
    console.log('Navigate to property:', propertyId);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={openDrawer}
            style={styles.drawerButton}>
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
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={() => setShowFilters(true)}
      />

      {/* Property Type Toggle */}
      <PropertyTypeToggle
        propertyForFilter={propertyForFilter}
        onFilterChange={setPropertyForFilter}
      />

      {/* Quick Filters */}
      <View style={styles.quickFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.quickFilter}>
            <Text style={styles.quickFilterText}>Under ₹2Cr</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickFilter}>
            <Text style={styles.quickFilterText}>2-5 BHK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickFilter}>
            <Text style={styles.quickFilterText}>Ready to Move</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickFilter}>
            <Text style={styles.quickFilterText}>Verified</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading ? 'Loading...' : `${totalCount} Properties Found`}
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
            <GetIcon iconName="filterFunnel" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesGrid}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load properties</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No properties found</Text>
            </View>
          ) : (
            filteredResults.map((property: Property) => (
              <PropertyCard
                key={property.propertyId}
                property={property}
                onPress={handlePropertyPress}
              />
            ))
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />
    </ScrollView>
  );
};

export default SearchPropertiesScreen;
