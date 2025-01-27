import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useMaster} from '../../context/MasterProvider';
import BuyerService from '../../services/BuyerService';
import PropertyModal from './PropertyModal';
import {PropertyModel} from '../../types';
import EnquiryButton from '../common/EnquiryButton';
import Colors from '../../constants/Colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

interface Property {
  ID: number;
  Location: string;
  Price: number;
  ShortDiscription: string;
  ImageURLType: {ImageUrl: string; Type: string; ID: number}[];
  PropertyType: {MasterDetailName: string; ID: number};
  Furnishing: {MasterDetailName: string; ID: number};
  Area: number;
  Parking: string;
  readyToMove: string;
  Rate: {MasterDetailName: string; ID: number};
}

const SearchProperty =  ({navigation}: HomeProps) => {
  const [searchText, setSearchText] = useState('');
  const [splitSearchText, setSplitSearchText] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [isSearchButtonPressed, setIsSearchButtonPressed] =
    useState<boolean>(false);
  const [predictions, setPredictions] = useState<
    {place_id: string; description: string}[]
  >([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    pageSize: 12,
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const {masterData} = useMaster();

  const allLocations = masterData?.ProjectLocation.map(
    (location: any) => location.MasterDetailName,
  );
  const stripHtmlTags = (html: string | null | undefined): string => {
    if (!html) {
      return '';
    }
    return html.replace(/<\/?[^>]+(>|$)/g, '').trim(); // Remove HTML tags
  };
  const handleSearch = async () => {
    console.log('Search Text:', searchText);
    console.log('Selected Location:', selectedLocation);
    console.log('Split Search Text:', splitSearchText);

    setLoading(true);
    setIsSearchButtonPressed(true);
    setHasMoreData(true);
    setPagination({
      currentPage: 1,
      totalPages: 0,
      pageSize: 12,
    });

    let placeArray: string[] = [];
    let cityParam = '';

    if (selectedLocation === 'All Location') {
      placeArray = allLocations || [];
      cityParam = '';
    } else if (selectedLocation) {
      placeArray = [selectedLocation, ...splitSearchText];
      cityParam = selectedLocation;
    } else {
      placeArray = splitSearchText;
      cityParam = '';
    }

    console.log('Place Array:', placeArray);
    console.log('City Param:', cityParam);

    try {
      const response = await BuyerService.filterProperties({
        Address: searchText,
        City: cityParam,
        pageNumber: 1,
        place: placeArray,
        PropertyFor: 'Sale',
        Relevance: 'Relevance',
        pageSize: pagination.pageSize,
      });
      console.log('API Response:', response);
      if (response.Success && response.data && response.data.propertyModels) {
        setSearchResults(response.data.propertyModels);
        setPagination({
          currentPage: response.data.responsePagingModel.CurrentPage,
          totalPages: response.data.responsePagingModel.TotalPage,
          pageSize: pagination.pageSize,
        });
        setHasMoreData(
          response.data.responsePagingModel.CurrentPage <
            response.data.responsePagingModel.TotalPage,
        );
      } else {
        setSearchResults([]);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProperties = async () => {
    if (!hasMoreData || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = pagination.currentPage + 1;

    let placeArray: string[] = [];
    let cityParam = '';
    if (selectedLocation === 'All Location') {
      placeArray = allLocations || [];
      cityParam = '';
    } else if (selectedLocation) {
      placeArray = [selectedLocation, ...splitSearchText];
      cityParam = selectedLocation;
    } else {
      placeArray = splitSearchText;
      cityParam = '';
    }

    try {
      const response = await BuyerService.filterProperties({
        Address: searchText,
        City: cityParam,
        pageNumber: nextPage,
        place: placeArray,
        PropertyFor: 'Sale',
        Relevance: 'Relevance',
        pageSize: pagination.pageSize,
      });

      if (response.Success && response.data && response.data.propertyModels) {
        setSearchResults(prev => [...prev, ...response.data.propertyModels]);
        setPagination({
          currentPage: response.data.responsePagingModel.CurrentPage,
          totalPages: response.data.responsePagingModel.TotalPage,
          pageSize: pagination.pageSize,
        });
        setHasMoreData(
          response.data.responsePagingModel.CurrentPage <
            response.data.responsePagingModel.TotalPage,
        );
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error loading more properties:', error);
      setHasMoreData(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    console.log('Selected Location:', location);
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null);
  };

  const toggleShowAllLocations = () => {
    setShowAllLocations(prev => !prev);
  };

  const getSearch = async (text: string) => {
    setSearchText(text);

    const stringWithoutCommas = text.replace(/,/g, '');
    const wordsArray = stringWithoutCommas.split(' ');
    const filteredWordsArray = wordsArray.filter(word => word.length > 0);

    setSplitSearchText(filteredWordsArray);

    try {
      const location = selectedLocation || '';
      const response = await BuyerService.getPlaces(text, location);

      console.log('Full API Response:', response?.predictions);

      if (response?.predictions) {
        console.log('Predictions State:', response.predictions);
        setPredictions(response.predictions);
      } else {
        console.log('No predictions found in the response.');
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPredictions([]);
    }
  };

  const clearSearchInput = () => {
    setSearchText('');
    setPredictions([]);
    setSplitSearchText([]);
  };

  const handleSuggestionSelect = (description: string) => {
    setSearchText(description);
    setPredictions([]);
  };

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  const visibleLocations = showAllLocations
    ? masterData?.ProjectLocation
    : masterData?.ProjectLocation.slice(0, 3);

  // eslint-disable-next-line react/no-unstable-nested-components
  const PropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.card}>
        {item.ImageURLType && item.ImageURLType.length > 0 && (
          <Image
            source={{ uri: item.ImageURLType[0].ImageUrl }}
            style={styles.cardImage}
          />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.Location}</Text>
          <Text style={styles.cardPrice}>
            ₹{item.Price} {item.Rate?.MasterDetailName}
          </Text>
          <Text style={styles.cardDescription}>
            {stripHtmlTags(item.ShortDiscription || '')}{' '}
            {/* Ensure it's a string */}
          </Text>
          <Text style={styles.cardInfo}>
            Property Type: {item.PropertyType?.MasterDetailName}
          </Text>
          <Text style={styles.cardInfo}>
            Furnishing: {item.Furnishing?.MasterDetailName}
          </Text>
          <Text style={styles.cardInfo}>Area: {item.Area} sq ft</Text>
          <View style={styles.bottomRow}>
            <View style={styles.details}>
              <Text style={styles.cardInfo}>Parking: {item.Parking}</Text>
              <Text style={styles.cardInfo}>Ready to Move: {item.readyToMove}</Text>
            </View>
            <EnquiryButton
              property={item as PropertyModel}
              buttonStyle={styles.enquiryButton}
              textStyle={styles.enquiryButtonText}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListFooterComponent = useCallback(() => {
    if (loading) {
      return null;
    }

    if (isSearchButtonPressed && searchResults.length === 0) {
      console.log('Rendering No Properties Message');
      return (
        <View style={styles.noPropertiesContainer}>
          <Text style={styles.noPropertiesText}>
            No properties available in this location
          </Text>
        </View>
      );
    }

    if (isLoadingMore && hasMoreData) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#cc0e74" />
          <Text style={styles.loadingMoreText}>Loading more properties...</Text>
        </View>
      );
    }

    return null;
  }, [
    loading,
    isLoadingMore,
    searchResults.length,
    hasMoreData,
    isSearchButtonPressed,
  ]);

  return (
    <View style={styles.container}>
        <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image
            source={require('../../assets/Images/menu.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <Text style={styles.contactText}>Search Property</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for properties..."
            value={searchText}
            onChangeText={getSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={clearSearchInput}
              style={styles.clearIcon}>
              <Text style={styles.clearIconText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={item => item.place_id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(item.description)}>
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.locationRow}>
        <TouchableOpacity
          style={[
            styles.locationItem,
            selectedLocation === 'All Location' && styles.selectedLocationItem,
          ]}
          onPress={() => handleLocationSelect('All Location')}>
          <Text
            style={[
              styles.locationText,
              selectedLocation === 'All Location' &&
                styles.selectedLocationText,
            ]}>
            All Location
          </Text>
        </TouchableOpacity>

        {visibleLocations?.map((location: any, index: any) => (
          <View key={index} style={styles.locationItemContainer}>
            <TouchableOpacity
              style={[
                styles.locationItem,
                selectedLocation === location.MasterDetailName &&
                  styles.selectedLocationItem,
              ]}
              onPress={() => handleLocationSelect(location.MasterDetailName)}>
              <Text
                style={[
                  styles.locationText,
                  selectedLocation === location.MasterDetailName &&
                    styles.selectedLocationText,
                ]}>
                {location.MasterDetailName}
              </Text>
            </TouchableOpacity>
            {selectedLocation === location.MasterDetailName && (
              <TouchableOpacity
                onPress={clearSelectedLocation}
                style={styles.clearSelectedLocationIcon}>
                <Text style={styles.clearSelectedLocationIconText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {masterData?.ProjectLocation && masterData?.ProjectLocation.length > 3 && (
          <TouchableOpacity
            style={styles.moreItem}
            onPress={toggleShowAllLocations}>
            <Text style={styles.moreText}>
              {showAllLocations ? 'Less...' : 'More...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#cc0e74" style={styles.loader} />
      ) : (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={item => `${item.ID}-${item.Location}`}
            renderItem={({item}) => <PropertyCard item={item} />}
            onEndReached={loadMoreProperties}
            onEndReachedThreshold={0.5}
            ListFooterComponent={ListFooterComponent}
          />
        </View>
      )}

      <PropertyModal
        property={selectedProperty as PropertyModel}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default SearchProperty;
const styles = StyleSheet.create({
  topBar: {
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Center items vertically
      paddingHorizontal: 1, // Add horizontal padding
      paddingVertical: 1, // Add vertical padding
      // backgroundColor: 'rgba(255, 182, 193, 0.6)', // Light pink with low opacity
      borderRadius: 15, // Rounded corners
      // marginHorizontal: '1%', // 5% space on both sides
      marginBottom: 20, // Add some top margin
    },
    menuIcon: {
      width: 24,
      height: 24,
      color: Colors.primary,
      marginRight: 20, // Add gap between icon and text
    },
    contactText: {
      fontSize: 20, // Adjust font size
      fontWeight: 'bold',
      color: Colors.primary,
    },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  noPropertiesContainer: {},
  noPropertiesText: {},
  loadingMoreContainer: {},
  loadingMoreText: {},
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearIcon: {
    padding: 10,
  },
  clearIconText: {
    fontSize: 16,
    color: '#ccc',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  splitTextContainer: {
    marginBottom: 10,
  },
  splitTextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  splitText: {
    fontSize: 14,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
    gap:5,
  },
  locationItemContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  locationItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedLocationItem: {
    backgroundColor: '#cc0e74',
  },
  locationText: {
    fontSize: 13,
    color: '#333',
  },
  // locationText2: {
  //   fontSize: 12,
  //   color: '#333',
  //   gap:5,
  //   width:65,
  // },
  selectedLocationText: {
    color: '#fff',
  },
  clearSelectedLocationIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cc0e74',
  },
  clearSelectedLocationIconText: {
    fontSize: 12,
    color: '#cc0e74',
  },
  moreItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  moreText: {
    fontSize: 14,
    color: '#cc0e74',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    maxHeight: 200,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  resultsContainer: {
    marginTop: 20,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardPrice: {
    fontSize: 18,
    color: '#cc0e74',
    fontWeight: '600',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  details: {
    flex: 1,
  },
  enquiryButton: {
    width: 105,
    paddingVertical: 8,
    backgroundColor: '#cc0e74',
    borderRadius: 8,
    alignItems: 'center',
  },
  enquiryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
  loadMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#cc0e74',
    borderRadius: 8,
    marginTop: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
