import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Text, Portal} from 'react-native-paper';

const {width: screenWidth} = Dimensions.get('window');

interface SuggestionDropdownProps {
  visible: boolean;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  position?: {top: number; left: number; width: number};
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  visible,
  suggestions,
  onSelect,
  position = {top: 100, left: 20, width: screenWidth - 40},
}) => {
  if (!visible || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Portal>
      <View
        style={[
          styles.container,
          {
            top: position.top,
            left: position.left,
            width: position.width,
          },
        ]}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => onSelect(suggestion)}
              activeOpacity={0.7}>
              <Text style={styles.text}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    zIndex: 9999,
    elevation: 50,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    flex: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    color: 'black',
  },
});

export default SuggestionDropdown;
