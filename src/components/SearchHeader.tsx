import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import Colors from '../constants/Colors';
import GetIcon from './GetIcon';

const SearchHeader = ({
  onSearch,
  placeholder,
}: {
  onSearch: (text: string) => void;
  placeholder: string;
}) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholderColor}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            onSearch(text);
          }}
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
          elevation={5}
          theme={{
            mode: 'adaptive',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
    height: 50,
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
