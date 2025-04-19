import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';
import FilterModal from './FilterModal';
import { FilterValues } from '../types';

const SearchAndFilter = ({
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
          placeholder="Search by name..."
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
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(!modalVisible)}>
        <GetIcon iconName="filter" color={Colors.black} size="24" />
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
    height: 50,
  },
  searchInputText: {
    color: Colors.placeholderColor,
  },
  filterButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 24,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  filterIcon: {
    height: 24,
    width: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SearchAndFilter;
