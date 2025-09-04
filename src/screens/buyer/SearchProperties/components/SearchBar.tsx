import React from 'react';
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
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <GetIcon iconName="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location, property type..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <View style={styles.clearText}>
              <Text style={styles.clearIcon}>✕</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}>
        <GetIcon iconName="filterFunnel" size={20} color={Colors.MT_PRIMARY_1} />
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
