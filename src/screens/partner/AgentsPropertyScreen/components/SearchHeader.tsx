import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, StyleSheet, Image} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {AgentData, FilterValues} from '../../../../types';
import Colors from '../../../../constants/Colors';
import FilterModal from './FilterModal';
import GetIcon from '../../../../components/GetIcon';

const SearchHeader = ({
  initialFilters,
  onSearch,
  onFilter,
  agentData,
}: {
  initialFilters: FilterValues;
  onSearch: (text: string) => void;
  onFilter: (filter: FilterValues) => void;
  agentData: AgentData[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search properties..."
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
        <Image
          source={require('../../../../assets/Icon/filter.png')}
          style={styles.filterIcon}
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
              agentData={agentData}
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
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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

export default SearchHeader;
