import React, {useState, useEffect, useCallback} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
}) => {
  // Local state for the input value
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce the search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearchChange(inputValue);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearchChange, searchQuery]);

  // Update local state when prop changes (e.g., from clear filters)
  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [inputValue, searchQuery]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <GetIcon iconName="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location, property type..."
          placeholderTextColor="gray"
          value={inputValue}
          onChangeText={setInputValue} // Use local state setter
          returnKeyType="search"
          onSubmitEditing={() => onSearchChange(inputValue)} // Search on enter
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <View style={styles.clearText}>
              <Text style={styles.clearIcon}>✕</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <GetIcon
          iconName="filterFunnel"
          size={20}
          color={Colors.MT_PRIMARY_1}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
    textAlignVertical: 'center' as const,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.MT_PRIMARY_1 + '10',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  clearText: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold' as const,
  },
};

export default SearchBar;
