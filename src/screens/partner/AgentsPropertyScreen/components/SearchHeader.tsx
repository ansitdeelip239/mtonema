import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, StyleSheet, Image} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {FilterValues} from '../../../../types';
import Colors from '../../../../constants/Colors';
import FilterModal from './FilterModal';

const SearchHeader = ({
  initialFilters,
  onSearch,
  onFilter,
}: {
  initialFilters: FilterValues;
  onSearch: (text: string) => void;
  onFilter: (filter: FilterValues) => void;
}) => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search agents..."
          placeholderTextColor={Colors.placeholderColor}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            onSearch(text);
          }}
          style={styles.searchInput}
          icon={() => (
            <Image
              source={require('../../../../assets/Icon/search.png')}
              style={styles.searchIcon}
            />
          )}
          clearIcon={
            searchText
              ? () => (
                  <Image
                    source={require('../../../../assets/Icon/crossicon.png')}
                    style={styles.clearIcon}
                  />
                )
              : undefined // Hide clear icon when searchText is empty
          }
          inputStyle={styles.searchInputText}
          elevation={5}
        />
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(!modalVisible)}>
        <Image
          source={require('../../../../assets/Icon/filter.png')}
          style={styles.filterIcon} // Use a separate style for the filter icon
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FilterModal
              initialFilters={initialFilters}
              onFilter={onFilter}
              onClose={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    // backgroundColor: 'white',
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    elevation: 5,
  },
  searchInputText: {
    color: Colors.placeholderColor,
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  clearIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.placeholderColor,
  },
  filterButton: {
    padding: 0,
    justifyContent: 'center',
  },
  filterIcon: {
    height: 24, // Increased size
    width: 24, // Increased size
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default SearchHeader;
