import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {MasterDetailModel} from '../types';
import {Chip, HelperText} from 'react-native-paper';
import Colors from '../constants/Colors';
import { useTheme } from '../context/ThemeProvider';

const FilterOption = ({
  label,
  options,
  selectedValue,
  onSelect,
  error,
}: {
  label: string;
  options: MasterDetailModel[];
  selectedValue: string | null | undefined;
  onSelect: (value: string) => void;
  error?: string;
}) => {
  const {theme} = useTheme();
  const [visibleLines, setVisibleLines] = useState(1);
  const buttonsPerLine = 4;

  const totalLines = Math.ceil(options.length / buttonsPerLine);

  const showMoreButton = visibleLines < totalLines;
  const showLessButton = !showMoreButton && visibleLines > 1;

  const selectedOption = options.find(
    option => option.masterDetailName === selectedValue,
  );
  const visibleButtons = options.slice(0, visibleLines * buttonsPerLine);

  const finalVisibleButtons =
    selectedOption && !visibleButtons.includes(selectedOption)
      ? [...visibleButtons, selectedOption]
      : visibleButtons;

  return (
    <View style={styles.filterSection}>
      <Text style={[styles.filterLabel, error ? styles.errorLabel : null]}>
        {label}
      </Text>
      <View style={styles.chipContainer}>
        {finalVisibleButtons.map(option => (
          <Chip
            key={option.id}
            selected={selectedValue === option.masterDetailName}
            onPress={() => onSelect(option.masterDetailName)}
            style={[
              styles.chip,
              selectedValue === option.masterDetailName && {backgroundColor: theme.primaryColor},
              error ? styles.errorChip : null,
            ]}
            showSelectedCheck={false}
            selectedColor={Colors.PRIMARY_1}
            textStyle={
              selectedValue === option.masterDetailName
                ? styles.selectedText
                : styles.chipText
            }
            mode={
              selectedValue === option.masterDetailName ? 'flat' : 'outlined'
            }
            compact>
            {option.masterDetailName}
          </Chip>
        ))}

        {showMoreButton && (
          <TouchableOpacity
            onPress={() => setVisibleLines(visibleLines + 1)}
            style={styles.moreLessButton}>
            <Chip
              style={styles.moreChip}
              textStyle={styles.moreChipText}
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
              style={styles.moreChip}
              textStyle={styles.moreChipText}
              compact>
              ..Less
            </Chip>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <HelperText type="error" visible={!!error} style={styles.helperText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 5,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  errorLabel: {
    color: '#cc0000',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  errorChip: {
    borderColor: '#cc0000',
  },
  chipText: {
    color: Colors.black,
  },
  selectedText: {
    color: 'white',
  },
  moreLessButton: {
    alignSelf: 'flex-end',
  },
  helperText: {
    marginTop: 4,
    color: '#cc0000',
    fontSize: 12,
  },
  moreChip: {
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    borderColor: '#d0d0d0',
  },
  moreChipText: {
    color: '#333',
    fontSize: 13,
  },
});

export default FilterOption;
