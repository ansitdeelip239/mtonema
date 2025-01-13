import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useMaster } from '../../context/MasterProvider';
import BuyerService from '../../services/BuyerService';

const SearchProperty = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [predictions, setPredictions] = useState<{ place_id: string; description: string }[]>([]);

  const { masterData } = useMaster();

  const handleSearch = () => {
    console.log('Search Text:', searchText);
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location); // Update the selected location state
    console.log('Selected Location:', location); // Log the selected location
  };

  const toggleShowAllLocations = () => {
    setShowAllLocations(!showAllLocations);
  };

  const visibleLocations = showAllLocations
    ? masterData?.ProjectLocation
    : masterData?.ProjectLocation.slice(0, 3);

  const getSearch = async (text: string) => {
    setSearchText(text); // Update the search text state
    try {
      const response = await BuyerService.getPlaces(text, selectedLocation as string);

      console.log('Full API Response:', response?.predictions);

      if (response?.predictions) {
        console.log('Predictions State:', response.predictions);
        setPredictions(response.predictions); // Update state with predictions
      } else {
        console.log('No predictions found in the response.');
        setPredictions([]); // Clear predictions if no data is found
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPredictions([]); // Clear predictions on error
    }
  };

  const handleSuggestionSelect = (description: string) => {
    setSearchText(description); // Update the input with the selected suggestion
    setPredictions([]); // Clear the suggestions
  };

  return (
    <View style={styles.container}>
      {/* Search Input and Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for properties..."
          value={searchText}
          onChangeText={getSearch}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Display Predictions as Suggestions */}
      {predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
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
        {visibleLocations.map((location: any, index: any) => (
          <TouchableOpacity
            key={index}
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
        ))}
        {!showAllLocations && (
          <TouchableOpacity
            style={styles.moreItem}
            onPress={toggleShowAllLocations}>
            <Text style={styles.moreText}>More...</Text>
          </TouchableOpacity>
        )}
      </View>
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
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0e74',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  locationItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
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
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    maxHeight: 200,
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
});
