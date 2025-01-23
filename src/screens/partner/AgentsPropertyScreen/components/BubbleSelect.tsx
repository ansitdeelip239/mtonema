import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const BubbleSelect = memo(
  ({
    label,
    options,
    selectedValue,
    onSelect,
  }: {
    label: string;
    options: {MasterDetailName: string; ID: string}[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
  }) => {
    return (
      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleLabel}>{label}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.ID}
              style={[
                styles.bubble,
                selectedValue !== null &&
                  selectedValue === option.MasterDetailName &&
                  styles.selectedBubble,
              ]}
              onPress={() => onSelect(option.MasterDetailName)}>
              <Text
                style={[
                  styles.bubbleText,
                  selectedValue !== null &&
                    selectedValue === option.MasterDetailName &&
                    styles.selectedBubbleText,
                ]}>
                {option.MasterDetailName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  bubbleContainer: {
    marginBottom: 20,
  },
  bubbleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedBubble: {
    backgroundColor: '#cc0e74',
  },
  bubbleText: {
    color: '#333',
    fontSize: 14,
  },
  selectedBubbleText: {
    color: 'white',
  },
});

export default BubbleSelect;
