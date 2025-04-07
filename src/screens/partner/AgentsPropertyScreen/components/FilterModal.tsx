import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import Colors from '../../../../constants/Colors';
import {useMaster} from '../../../../context/MasterProvider';
import FilterOption from '../../../../components/FilterOption';
import {FilterValues} from '../../../../types';

const FilterModal = ({
  initialFilters,
  onFilter,
  onClose,
  locations,
}: {
  initialFilters: FilterValues;
  onFilter: (filters: FilterValues) => void;
  onClose: () => void;
  locations: string[];
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const {masterData} = useMaster();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const mappedLocations = useMemo(() => {
    return locations.map((location, index) => ({
      id: index + 1,
      masterDetailName: location,
      MasterID: 0,
      CreatedOn: null,
      UpdatedOn: null,
      CreatedBy: null,
      UpdatedBy: null,
      Status: 1,
    }));
  }, [locations]);

  const propertyTypes = useMemo(
    () => masterData?.AgentPropertyType || [],
    [masterData],
  );
  const bhkTypes = useMemo(() => masterData?.BhkType || [], [masterData]);

  const haveFiltersChanged = useMemo(() => {
    return (
      filters.propertyLocation !== initialFilters.propertyLocation ||
      filters.propertyType !== initialFilters.propertyType ||
      filters.bhkType !== initialFilters.bhkType
    );
  }, [filters, initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== null);
  }, [filters]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [fadeAnim, slideAnim, onClose]);

  const handleApplyFilter = useCallback(() => {
    if (haveFiltersChanged) {
      onFilter(filters);
    }
    handleClose();
  }, [filters, onFilter, haveFiltersChanged, handleClose]);

  const handleSelect = useCallback((key: keyof FilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({
      propertyLocation: null,
      propertyType: null,
      bhkType: null,
    });
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]}>
      <TouchableOpacity
        style={styles.modalOverlayTouchable}
        activeOpacity={1}
        onPress={handleClose}>
        <Animated.View
          style={[styles.modalContent, {transform: [{translateY: slideAnim}]}]}
          onStartShouldSetResponder={() => true}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Filter Properties</Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={handleClearAllFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FilterOption
            label="Location"
            options={mappedLocations}
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
              onPress={handleClose}>
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
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayTouchable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    elevation: 15,
    shadowColor: Colors.PRIMARY_1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.main,
    fontWeight: '500',
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
