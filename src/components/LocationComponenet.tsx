import React, {useState, useCallback} from 'react';
import {View, FlatList, Keyboard, StyleSheet, Image} from 'react-native';
import {TextInput, Text} from 'react-native-paper';
import BuyerService from '../services/BuyerService';

const LocationComponent = ({
  onLocationChange,
}: {
  onLocationChange: (value: string) => void;
}) => {
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch location suggestions from your backend API
  const searchLocationSuggestion = async (keyword: string) => {
    try {
      const response = await BuyerService.getPlaces(keyword, 'India');
      console.log(response);

      // Check if response is defined and has the expected structure
      if (response && response.predictions) {
        // Extract the descriptions from the predictions array
        const suggestions = response.predictions.map(
          (prediction: {description: string}) => prediction.description,
        );
        setLocationSuggestions(suggestions); // Update location suggestions
        setShowSuggestions(true); // Show the dropdown
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error(error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchLocationSuggestion = useCallback(
    debounce(searchLocationSuggestion, 200),
    [searchLocationSuggestion],
  );

  // Handle input changes for the Location field
  const handleInputChange = (value: string) => {
    onLocationChange(value);
    setLocationQuery(value);
    if (value.length > 0) {
      debouncedSearchLocationSuggestion(value);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle location suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setLocationQuery(suggestion); // Update the search query
    onLocationChange(suggestion); // Notify parent component
    setShowSuggestions(false); // Hide the dropdown
    Keyboard.dismiss();
  };

  // Clear input field
  const clearInputField = () => {
    setLocationQuery('');
    onLocationChange('');
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.txtpadding}>
        <TextInput
          label="Location"
          value={locationQuery}
          onChangeText={text => handleInputChange(text)}
          mode="outlined"
          onFocus={() => {
            if (locationQuery.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            if (!isSelectingSuggestion) {
              setTimeout(() => {
                setShowSuggestions(false);
              }, 200);
            }
          }}
          right={
            locationQuery !== '' && (
              <TextInput.Icon
                // eslint-disable-next-line react/no-unstable-nested-components
                icon={() => (
                  <Image
                    style={styles.crossicon}
                    source={require('../assets/Icon/crossicon.png')}
                  />
                )}
                onPress={clearInputField}
              />
            )
          }
        />

        {showSuggestions &&
          locationQuery.length > 0 &&
          locationSuggestions.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                locationSuggestions.length > 5 && styles.scrollableSuggestions,
              ]}>
              <FlatList
                keyboardShouldPersistTaps="always"
                data={locationSuggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.suggestionItem}>
                    <Text
                      onPress={() => {
                        setIsSelectingSuggestion(true);
                        handleSuggestionSelect(item);
                        setIsSelectingSuggestion(false);
                      }}>
                      {item}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  txtpadding: {
    marginBottom: 28,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 5,
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollableSuggestions: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  crossicon: {
    width: 24,
    height: 24,
  },
});

export default LocationComponent;
