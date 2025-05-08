import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface ClearFormButtonProps {
  onPress: () => void;
  backgroundColor: string;
}

const ClearFormButton: React.FC<ClearFormButtonProps> = ({
  onPress,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.clearButton, {backgroundColor}]}>
      <Text style={styles.clearButtonText}>Clear</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClearFormButton;
