import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../../../constants/Colors';
import {useMaster} from '../../../../context/MasterProvider';
import FilterOption from './FilterOption';
import {FilterValues} from '../../../../types';

const FilterModal = ({
  initialFilters,
  onFilter,
  onClose,
}: {
  initialFilters: FilterValues;
  onFilter: (filters: FilterValues) => void;
  onClose: () => void;
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const {masterData} = useMaster();

  const locations = useMemo(
    () => masterData?.ProjectLocation || [],
    [masterData],
  );
  const propertyTypes = useMemo(
    () => masterData?.PropertyType || [],
    [masterData],
  );
  const bhkTypes = useMemo(() => masterData?.BhkType || [], [masterData]);

  // Track if filters have changed
  const haveFiltersChanged = useMemo(() => {
    return (
      filters.propertyLocation !== initialFilters.propertyLocation ||
      filters.propertyType !== initialFilters.propertyType ||
      filters.bhkType !== initialFilters.bhkType
    );
  }, [filters, initialFilters]);

  const handleApplyFilter = useCallback(() => {
    if (haveFiltersChanged) {
      onFilter(filters);
    }
    onClose();
  }, [filters, onFilter, onClose, haveFiltersChanged]);

  const handleSelect = useCallback((key: keyof FilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Filter Properties</Text>
      <FilterOption
        label="Location"
        options={locations}
        selectedValue={filters.propertyLocation}
        onSelect={value => handleSelect('propertyLocation', value)}
      />
      <FilterOption
        label="Property Type"
        options={propertyTypes}
        selectedValue={filters.propertyType}
        onSelect={value => handleSelect('propertyType', value)}
      />
      <FilterOption
        label="BHK Type"
        options={bhkTypes}
        selectedValue={filters.bhkType}
        onSelect={value => handleSelect('bhkType', value)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.applyButton]}
          onPress={handleApplyFilter}>
          <Text style={[styles.buttonText, styles.applyText]}>
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    elevation: 15,
    shadowColor: Colors.PRIMARY_1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default FilterModal;
