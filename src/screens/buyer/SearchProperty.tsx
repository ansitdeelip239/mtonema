import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useMaster} from '../../context/MasterProvider';


const SearchProperty = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAllLocations, setShowAllLocations] = useState(false); // State to toggle "More..."

  const {masterData} = useMaster();

  const handleSearch = () => {
    console.log('Search Text:', searchText);
    // Add your search logic here
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    // You can add additional logic here, like filtering properties based on the selected location
  };

  const toggleShowAllLocations = () => {
    setShowAllLocations(!showAllLocations); // Toggle to show all locations
  };

  // Display only 3 locations + "More..." initially
  const visibleLocations = showAllLocations
    ? masterData?.ProjectLocation
    : masterData?.ProjectLocation.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Search Input and Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for properties..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Location Row */}
      <View style={styles.locationRow}>
        {visibleLocations.map((location:any, index:any) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.locationItem,
              selectedLocation === location.MasterDetailName && styles.selectedLocationItem,
            ]}
            onPress={() => handleLocationSelect(location.MasterDetailName)}>
            <Text
              style={[
                styles.locationText,
                selectedLocation === location.MasterDetailName && styles.selectedLocationText,
              ]}>
              {location.MasterDetailName}
            </Text>
          </TouchableOpacity>
        ))}
        {!showAllLocations && ( // Show "More..." only when not showing all locations
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
    height: 50, // Increased height
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15, // Increased padding
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 16, // Larger font size
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
    flexWrap: 'wrap', // Allow items to wrap to the next line
    alignItems: 'center',
    marginTop: 10,
  },
  locationItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10, // Add margin to separate rows
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedLocationItem: {
    backgroundColor: '#cc0e74', // Background color for selected location
  },
  locationText: {
    fontSize: 14, // Small font size
    color: '#333',
  },
  selectedLocationText: {
    color: '#fff', // Text color for selected location
  },
  moreItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  moreText: {
    fontSize: 14,
    color: '#cc0e74', // Highlight "More..." in blue
    fontWeight: 'bold',
  },
});
