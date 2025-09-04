import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {BuyerBottomTabParamList} from '../../types/navigation';
import {useDrawer} from '../../hooks/useDrawer';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Search Property'>;

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  isVerified?: boolean;
}

interface FilterOptions {
  propertyType: string[];
  priceRange: {min: string; max: string};
  bedrooms: string;
  location: string;
  sortBy: string;
}

const SearchPropertiesScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {openDrawer} = useDrawer();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    propertyType: [],
    priceRange: {min: '', max: ''},
    bedrooms: '',
    location: '',
    sortBy: 'relevance',
  });

  // Mock search results
  const [searchResults] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern 3BHK Apartment',
      location: 'Andheri West, Mumbai',
      price: '₹2.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=1'},
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,200 sq ft',
      isVerified: true,
    },
    {
      id: '2',
      title: 'Luxury Villa',
      location: 'Thane West',
      price: '₹4.2 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=2'},
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sq ft',
      isVerified: true,
    },
    {
      id: '3',
      title: 'Penthouse with Sea View',
      location: 'Bandra West, Mumbai',
      price: '₹8.5 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=3'},
      type: 'Penthouse',
      bedrooms: 4,
      bathrooms: 4,
      area: '3,200 sq ft',
    },
    {
      id: '4',
      title: 'Cozy 2BHK Flat',
      location: 'Powai, Mumbai',
      price: '₹1.8 Cr',
      image: {uri: 'https://picsum.photos/300/200?random=4'},
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: '950 sq ft',
      isVerified: true,
    },
  ]);

  const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Plot', 'Commercial'];
  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const sortOptions = [
    {label: 'Relevance', value: 'relevance'},
    {label: 'Price: Low to High', value: 'price_asc'},
    {label: 'Price: High to Low', value: 'price_desc'},
    {label: 'Newest First', value: 'newest'},
  ];

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const toggleBedroomFilter = (bedroom: string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms === bedroom ? '' : bedroom,
    }));
  };

  const applyFilters = () => {
    setShowFilters(false);
    // Here you would typically make an API call with the filters
    console.log('Applying filters:', filters);
  };

  const clearFilters = () => {
    setFilters({
      propertyType: [],
      priceRange: {min: '', max: ''},
      bedrooms: '',
      location: '',
      sortBy: 'relevance',
    });
  };

  const renderPropertyCard = (property: Property) => (
    <TouchableOpacity
      key={property.id}
      style={styles.propertyCard}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to property details
        console.log('Navigate to property:', property.id);
      }}>
      <View style={styles.propertyImageContainer}>
        <Image
          source={property.image}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        {property.isVerified && (
          <View style={styles.verifiedBadge}>
            <GetIcon iconName="premium" size={14} color="white" />
          </View>
        )}
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          <GetIcon iconName="locationPin" size={12} color="#666" />
          {' ' + property.location}
        </Text>
        <Text style={styles.propertyPrice}>{property.price}</Text>

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="doubleBed" size={12} color="#666" />
            {' ' + property.bedrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="room" size={12} color="#666" />
            {' ' + property.bathrooms}
          </Text>
          <Text style={styles.propertyDetail}>
            <GetIcon iconName="area" size={12} color="#666" />
            {' ' + property.area}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Property Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Property Type</Text>
              <View style={styles.filterOptions}>
                {propertyTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.propertyType.includes(type) && styles.filterOptionSelected,
                    ]}
                    onPress={() => togglePropertyType(type)}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.propertyType.includes(type) && styles.filterOptionTextSelected,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Bedrooms</Text>
              <View style={styles.filterOptions}>
                {bedroomOptions.map(bedroom => (
                  <TouchableOpacity
                    key={bedroom}
                    style={[
                      styles.filterOption,
                      filters.bedrooms === bedroom && styles.filterOptionSelected,
                    ]}
                    onPress={() => toggleBedroomFilter(bedroom)}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.bedrooms === bedroom && styles.filterOptionTextSelected,
                      ]}>
                      {bedroom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range (₹)</Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChangeText={(text) =>
                    setFilters(prev => ({
                      ...prev,
                      priceRange: {...prev.priceRange, min: text},
                    }))
                  }
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChangeText={(text) =>
                    setFilters(prev => ({
                      ...prev,
                      priceRange: {...prev.priceRange, max: text},
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option.value && styles.sortOptionSelected,
                  ]}
                  onPress={() =>
                    setFilters(prev => ({...prev, sortBy: option.value}))
                  }>
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === option.value && styles.sortOptionTextSelected,
                    ]}>
                    {option.label}
                  </Text>
                  {filters.sortBy === option.value && (
                    <GetIcon iconName="premium" size={16} color={Colors.MT_PRIMARY_1} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <GetIcon iconName="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, property type..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}>
          <GetIcon iconName="filterFunnel" size={20} color={Colors.MT_PRIMARY_1} />
        </TouchableOpacity>
      </View>

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
            {searchResults.length} Properties Found
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
            <GetIcon iconName="filterFunnel" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesGrid}>
          {searchResults.map(property => renderPropertyCard(property))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </View>

      {/* Filter Modal */}
      {renderFilterModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerTop: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'center',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.MT_PRIMARY_1 + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickFilters: {
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  quickFilter: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  quickFilterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  propertiesGrid: {
    paddingHorizontal: 20,
    gap: 15,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  propertyImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 12,
    padding: 4,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyDetail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  filterOptionSelected: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderColor: Colors.MT_PRIMARY_1,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: 'white',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sortOptionSelected: {
    backgroundColor: Colors.MT_PRIMARY_1 + '10',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sortOptionTextSelected: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SearchPropertiesScreen;
