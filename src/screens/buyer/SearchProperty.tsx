import React, { useState } from 'react';
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
import { useMaster } from '../../context/MasterProvider';
import BuyerService from '../../services/BuyerService';
import PropertyModal from './PropertyModal'; // Import the PropertyModal component
import { PropertyModel } from '../../types';

// Define the Property interface
interface Property {
  ID: number;
  Location: string;
  Price: number;
  ShortDiscription: string;
  ImageURLType: { ImageUrl: string; Type: string; ID: number }[];
  PropertyType: { MasterDetailName: string; ID: number };
  Furnishing: { MasterDetailName: string; ID: number };
  Area: number;
  Parking: string;
  readyToMove: string;
  Rate: { MasterDetailName: string; ID: number };
}

const SearchProperty = () => {
  const [searchText, setSearchText] = useState('');
  const [splitSearchText, setSplitSearchText] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [predictions, setPredictions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    pageSize: 12,
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null); // State for selected property
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const { masterData } = useMaster();

  // Create an array of all locations
  const allLocations = masterData?.ProjectLocation.map(
    (location: any) => location.MasterDetailName,
  );

  const handleSearch = async () => {
    console.log('Search Text:', searchText);
    console.log('Selected Location:', selectedLocation);
    console.log('Split Search Text:', splitSearchText);
    setLoading(true);
    // Determine the place array and city based on selection
    let placeArray: string[] = [];
    let cityParam = '';
    if (selectedLocation === 'All Location') {
      // When "All Location" is selected, use all locations for place array
      // and keep city parameter as empty string
      placeArray = allLocations || [];
      cityParam = '';
    } else if (selectedLocation) {
      // When a specific location is selected
      placeArray = [selectedLocation, ...splitSearchText];
      cityParam = selectedLocation;
    } else {
      // When no location is selected
      placeArray = splitSearchText;
      cityParam = '';
    }
    try {
      const response = await BuyerService.filterProperties({
        Address: searchText,
        City: cityParam,
        pageNumber: pagination.currentPage,
        place: placeArray,
        PropertyFor: 'Sale',
        Relevance: 'Relevance',
        pageSize: pagination.pageSize,
      });

      console.log('API Response:', response.data);
      if (response.Success && response.data && response.data.propertyModels) {
        setSearchResults(response.data.propertyModels);
        setPagination({
          currentPage: response.data.responsePagingModel.CurrentPage,
          totalPages: response.data.responsePagingModel.TotalPage,
          pageSize: pagination.pageSize,
        });
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
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

    // Split the search text into words
    const stringWithoutCommas = text.replace(/,/g, '');
    const wordsArray = stringWithoutCommas.split(' ');
    const filteredWordsArray = wordsArray.filter(word => word.length > 0);

    // Update the splitSearchText state
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

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
      handleSearch();
    }
  };

  // Handle property card click
  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  // Filter visible locations based on showAllLocations state
  const visibleLocations = showAllLocations
    ? masterData?.ProjectLocation
    : masterData?.ProjectLocation.slice(0, 3);

  // Property Card Component
  // eslint-disable-next-line react/no-unstable-nested-components
  const PropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <View style={styles.card}>
        {/* Display the first image if available */}
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
          <Text style={styles.cardDescription}>{item.ShortDiscription}</Text>
          <Text style={styles.cardInfo}>
            Property Type: {item.PropertyType?.MasterDetailName}
          </Text>
          <Text style={styles.cardInfo}>
            Furnishing: {item.Furnishing?.MasterDetailName}
          </Text>
          <Text style={styles.cardInfo}>Area: {item.Area} sq ft</Text>
          <Text style={styles.cardInfo}>Parking: {item.Parking}</Text>
          <Text style={styles.cardInfo}>Ready to Move: {item.readyToMove}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input and Button */}
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

      {/* Display Split Search Text */}
      <View style={styles.splitTextContainer}>
        <Text style={styles.splitTextTitle}>Split Search Text:</Text>
        <Text style={styles.splitText}>{splitSearchText.join(', ')}</Text>
      </View>

      {/* Display Predictions as Suggestions */}
      {predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={item => item.place_id}
            renderItem={({ item }) => {
              console.log('Rendering Item:', item);
              return (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item.description)}>
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Location Row */}
      <View style={styles.locationRow}>
        {/* Add "All Location" Button */}
        <TouchableOpacity
          style={[
            styles.locationItem,
            selectedLocation === 'All Location' && styles.selectedLocationItem,
          ]}
          onPress={() => handleLocationSelect('All Location')}>
          <Text
            style={[
              styles.locationText,
              selectedLocation === 'All Location' && styles.selectedLocationText,
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
        {masterData?.ProjectLocation.length > 3 && (
          <TouchableOpacity
            style={styles.moreItem}
            onPress={toggleShowAllLocations}>
            <Text style={styles.moreText}>
              {showAllLocations ? 'Less...' : 'More...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Display Search Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#cc0e74" style={styles.loader} />
      ) : (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={item => item.ID.toString()}
            renderItem={({ item }) => <PropertyCard item={item} />}
            ListFooterComponent={
              pagination.currentPage < pagination.totalPages ? (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}>
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      )}

      {/* Property Modal */}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
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
  },
  locationItemContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  locationItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedLocationItem: {
    backgroundColor: '#cc0e74',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPrice: {
    fontSize: 14,
    color: '#cc0e74',
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cardInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
