import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import Colors from '../constants/Colors';
import GetIcon from './GetIcon';

const SearchHeader = ({
  onSearch,
  placeholder,
  debounceTime = 500,
}: {
  onSearch: (text: string) => void;
  placeholder: string;
  debounceTime?: number;
}) => {
  const [searchText, setSearchText] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleTextChange = (text: string) => {
    setSearchText(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(text);
    }, debounceTime);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholderColor}
        value={searchText}
        onChangeText={handleTextChange}
        style={styles.searchInput}
        icon={() =>
          GetIcon({iconName: 'search', color: Colors.placeholderColor})
        }
        clearIcon={
          searchText
            ? () => GetIcon({iconName: 'clear', color: '#000'})
            : undefined
        }
        inputStyle={styles.searchInputText}
        elevation={1}
        theme={{
          mode: 'adaptive',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    width: '100%',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
    height: 50,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchInputText: {
    color: Colors.placeholderColor,
  },
});

export default SearchHeader;
