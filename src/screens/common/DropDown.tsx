import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

interface DropDownProps {
  data: Array<{ [key: string]: any }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
  displayKey: string;
  valueKey: string;
}

const DropDown: React.FC<DropDownProps> = ({
  data,
  selectedValue,
  onSelect,
  placeholder,
  displayKey,
  valueKey,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (value: any) => {
    onSelect(value);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    onSelect('');
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownInput}
        onPress={() => setShowDropdown(true)}>
        {/* Selected Value or Placeholder */}
        <View style={styles.textContainer}>
          {selectedValue ? (
            <Text style={styles.selectedValueText}>
              {data.find((item) => item[valueKey] === selectedValue)?.[displayKey]}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>

        {/* Clear Button (X) - Only appears when a value is selected */}
        {selectedValue && (
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}

        {/* Dropdown Arrow Image */}
        <Image
          source={require('../../assets/Icon/down.png')} // Path to your dropdown arrow image
          style={styles.dropdownArrow}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}>
        {/* Overlay to close the dropdown when clicked outside */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1} // Prevents the overlay from flashing when clicked
          onPress={() => setShowDropdown(false)}>
          {/* Dropdown Content */}
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item) => item[valueKey].toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item[valueKey])}>
                  <Text style={styles.dropdownItemText}>{item[displayKey]}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dropdownInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10, // Add horizontal padding
    flexDirection: 'row', // Align text, clear button, and arrow horizontally
    justifyContent: 'space-between', // Space between elements
    alignItems: 'center', // Center items vertically
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1, // Take up remaining space
  },
  selectedValueText: {
    fontSize: 16,
    color: '#000', // Ensure text color is visible
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  clearButton: {
    padding: 5,
    marginRight: 10, // Space between clear button and dropdown arrow
  },
  clearButtonText: {
    fontSize: 16,
    color: 'red',
  },
  dropdownArrow: {
    width: 15, // Adjust width as needed
    height: 15, // Adjust height as needed
    tintColor: '#cc0e74', // Optional: Change the color of the arrow
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8, // 80% of screen width
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000', // Ensure text color is visible
  },
});

export default DropDown;