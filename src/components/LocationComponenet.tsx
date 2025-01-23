import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';
import BuyerService from '../services/BuyerService';

const LocationComponent = ({onLocationChange} : { onLocationChange: (value:string) => void
}) => {
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
    debounce(searchLocationSuggestion, 300),
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
    setShowSuggestions(false); // Hide the dropdown
    Keyboard.dismiss();
  };

  // Clear input field
  const clearInputField = () => {
    setLocationQuery('');
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      {/* Location Input */}
      <View style={styles.txtpadding}>
        <Text style={[styles.label]}>Location</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'Location' && styles.inputFocused,
            ]}
            value={locationQuery}
            onChangeText={text => handleInputChange(text)}
            placeholder="Search Location"
            onFocus={() => {
              setFocusedInput('Location');
              if (locationQuery.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              if (!isSelectingSuggestion) {
                setFocusedInput(null);
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 200);
              }
            }}
          />
          {locationQuery !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearInputField()}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {showSuggestions &&
          locationQuery.length > 0 &&
          locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                keyboardShouldPersistTaps="always"
                data={locationSuggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPressIn={() => setIsSelectingSuggestion(true)}
                    onPress={() => {
                      handleSuggestionSelect(item);
                      setIsSelectingSuggestion(false);
                    }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
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
    // flex: 1,
    backgroundColor: '#fff',
  },
  txtpadding: {
    marginBottom: 20,
  },
  label: {fontSize: 16, color: '#333', marginBottom: 8},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: 'red', // Red border for errors
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#880e4f', // Dark pink
  },
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: '#FFFFFF',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputFocused: {
    borderColor: '#cc0e74', // color border when focused
    borderWidth: 1.9,
  },
});

export default LocationComponent;
