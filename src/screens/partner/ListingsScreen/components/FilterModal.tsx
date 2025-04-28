import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '../../../../constants/Colors';
import {useMaster} from '../../../../context/MasterProvider';
import FilterOption from '../../../../components/FilterOption';
import {FilterValues} from '../types';
import {convertToMasterDetailModel} from '../../../../utils/formUtils';

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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const propertyForTypes = useMemo(
    () => masterData?.PropertyFor || [],
    [masterData],
  );

  const statusTypes = useMemo(
    () => convertToMasterDetailModel(['Active', 'Inactive', 'Deleted']),
    [],
  );

  const cityTypes = useMemo(
    () => masterData?.ProjectLocation || [],
    [masterData],
  );

  const haveFiltersChanged = useMemo(() => {
    return (
      filters.city !== initialFilters.city ||
      filters.propertyFor !== initialFilters.propertyFor ||
      filters.status !== initialFilters.status
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
      city: null,
      propertyFor: null,
      status: null,
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
          onStartShouldSetResponder={() => true}
          onTouchEnd={e => e.stopPropagation()}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Filter Properties</Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={handleClearAllFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            contentContainerStyle={styles.scrollViewContent}
            nestedScrollEnabled={true}
            fadingEdgeLength={40}>
            <TouchableWithoutFeedback>
              <View style={styles.filterOptionsContainer}>
                <FilterOption
                  label="Property For"
                  options={propertyForTypes}
                  selectedValue={filters.propertyFor}
                  onSelect={value => handleSelect('propertyFor', value)}
                />
                <FilterOption
                  label="Status"
                  options={statusTypes}
                  selectedValue={filters.status}
                  onSelect={value => handleSelect('status', value)}
                />
                <FilterOption
                  label="City"
                  options={cityTypes}
                  selectedValue={filters.city}
                  onSelect={value => handleSelect('city', value)}
                />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

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
    paddingRight: 15,
    elevation: 15,
    shadowColor: Colors.PRIMARY_1,
    minHeight: '60%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.MT_PRIMARY_1,
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
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  applyText: {
    color: 'white',
  },
  scrollView: {
    maxHeight: 450,
    paddingRight: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  filterOptionsContainer: {
    gap: 20,
  },
});

export default FilterModal;
