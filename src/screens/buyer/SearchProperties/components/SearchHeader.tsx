import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';

const SearchHeader = ({
  onSearch,
  placeholder,
  onFilterPress,
}: {
  onSearch: (text: string) => void;
  placeholder: string;
  onFilterPress?: () => void;
}) => {
  const [searchText, setSearchText] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleTextChange = (text: string) => {
    setSearchText(text);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // If empty string, trigger search immediately
    if (text.trim() === '') {
      onSearch('');
      return;
    }

    // Set a new timeout for 500ms
    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(text);
    }, 500);
  };

  const handleClear = () => {
    setSearchText('');
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Immediately trigger search with empty string when clearing
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInput}>
            <GetIcon
              iconName="search"
              color={Colors.placeholderColor}
              size={18}
            />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={Colors.placeholderColor}
              value={searchText}
              onChangeText={handleTextChange}
              style={styles.searchInputText}
              returnKeyType="search"
            />
            {searchText ? (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}>
                <GetIcon iconName="clear" color="#000" size={16} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {onFilterPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilterPress}
            activeOpacity={0.7}>
            <GetIcon iconName="filter" color="#666" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    width: '100%',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
    height: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  searchInputText: {
    flex: 1,
    color: '#000',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 22.5,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchHeader;
