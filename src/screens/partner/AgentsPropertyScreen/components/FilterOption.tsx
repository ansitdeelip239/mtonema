import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {MasterDetailModel} from '../../../../types';
import {Chip} from 'react-native-paper';
import Colors from '../../../../constants/Colors';

const FilterOption = ({
  label,
  options,
  selectedValue,
  onSelect,
}: {
  label: string;
  options: MasterDetailModel[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) => {
  const [visibleLines, setVisibleLines] = useState(1);
  const buttonsPerLine = 4;

  const totalLines = Math.ceil(options.length / buttonsPerLine);

  const showMoreButton = visibleLines < totalLines;
  const showLessButton = !showMoreButton && visibleLines > 1;

  const selectedOption = options.find(
    option => option.MasterDetailName === selectedValue,
  );
  const visibleButtons = options.slice(0, visibleLines * buttonsPerLine);

  const finalVisibleButtons =
    selectedOption && !visibleButtons.includes(selectedOption)
      ? [...visibleButtons, selectedOption]
      : visibleButtons;

  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.chipContainer}>
        {finalVisibleButtons.map(option => (
          <Chip
            key={option.ID}
            selected={selectedValue === option.MasterDetailName}
            onPress={() => onSelect(option.MasterDetailName)}
            style={[
              styles.chip,
              selectedValue === option.MasterDetailName && styles.selectedChip,
            ]}
            showSelectedCheck={false}
            selectedColor={Colors.PRIMARY_1}
            textStyle={
              selectedValue === option.MasterDetailName
                ? styles.selectedText
                : styles.chipText
            }
            mode={
              selectedValue === option.MasterDetailName ? 'flat' : 'outlined'
            }
            compact>
            {option.MasterDetailName}
          </Chip>
        ))}

        {showMoreButton && (
          <TouchableOpacity
            onPress={() => setVisibleLines(visibleLines + 1)}
            style={styles.moreLessButton}>
            <Chip
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
              compact>
              More..
            </Chip>
          </TouchableOpacity>
        )}

        {showLessButton && (
          <TouchableOpacity
            onPress={() => setVisibleLines(1)}
            style={styles.moreLessButton}>
            <Chip
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
              compact>
              ..Less
            </Chip>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: Colors.PRIMARY_1,
  },
  chipText: {
    color: Colors.PRIMARY_1,
  },
  selectedText: {
    color: 'white',
  },
  moreLessButton: {
    alignSelf: 'flex-end',
  },
});

export default FilterOption;
