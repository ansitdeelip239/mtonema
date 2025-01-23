import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
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
        <Image
          source={require('../../../../assets/Icon/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search agents..."
          placeholderTextColor={Colors.placeholderColor}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            onSearch(text);
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(!modalVisible)}>
        <Image
          source={require('../../../../assets/Icon/filter.png')}
          style={styles.searchIcon}
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
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
  },
  searchIcon: {
    padding: 10,
    height: 5,
    width: 5,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  filterButton: {
    padding: 0,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    borderColor: '#ccc',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  applyButton: {
    backgroundColor: '#cc0e74',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  applyText: {
    color: 'white',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerItem: {
    color: 'black', // Default text color
  },
  placeholderItem: {
    color: '#888', // Slightly lighter for placeholder
  },
});

export default SearchHeader;
