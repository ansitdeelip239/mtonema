import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Colors from '../../../../constants/Colors';
import {useMaster} from '../../../../context/MasterProvider';
import FilterOption from '../../../../components/FilterOption';
import {PropertySearchParams} from '../../../../types';
import {useTranslation} from 'react-i18next';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<PropertySearchParams>) => void;
  onClearFilters: () => void;
  currentFilters: Partial<PropertySearchParams>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<
    Partial<PropertySearchParams>
  >({});
  const {masterData} = useMaster();
  const {t} = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Combine current filters with local changes
  const filters = useMemo(
    () => ({
      ...currentFilters,
      ...localFilters,
    }),
    [currentFilters, localFilters],
  );

  // Available filter options from master data
  const propertyTypes = useMemo(
    () => masterData?.PropertyType || [],
    [masterData],
  );

  const bhkTypes = useMemo(() => masterData?.BhkType || [], [masterData]);

  const furnishTypes = useMemo(
    () => masterData?.FurnishType || [],
    [masterData],
  );

  const cities = useMemo(() => masterData?.ProjectLocation || [], [masterData]);

  // Check if filters have changed
  const haveFiltersChanged = useMemo(() => {
    return (
      localFilters.propertyTypes !== undefined ||
      localFilters.bhkType !== undefined ||
      localFilters.furnishing !== undefined ||
      localFilters.city !== undefined ||
      localFilters.minAmount !== undefined ||
      localFilters.maxAmount !== undefined
    );
  }, [localFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      value => value !== null && value !== undefined && value !== '',
    );
  }, [filters]);

  useEffect(() => {
    if (visible) {
      // Start entry animations when modal becomes visible
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animation values when modal is not visible
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    }

    // Cleanup function to stop any running animations
    return () => {
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
    };
  }, [visible, fadeAnim, slideAnim]);

  // Reset local filters when modal opens
  useEffect(() => {
    if (visible) {
      setLocalFilters({});
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    // Stop any existing animations
    fadeAnim.stopAnimation();
    slideAnim.stopAnimation();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Defer the state update to avoid useInsertionEffect conflict
      setTimeout(() => {
        onClose(); // This calls setShowFilters(false)
      }, 0);
    });
  }, [fadeAnim, slideAnim, onClose]);

  const handleApplyFilters = useCallback(() => {
    if (haveFiltersChanged) {
      onApplyFilters(filters);
    }

    // Defer the close to avoid timing conflicts
    setTimeout(() => {
      handleClose();
    }, 0);
  }, [filters, onApplyFilters, haveFiltersChanged, handleClose]);

  const handleClearAllFilters = useCallback(() => {
    setLocalFilters({});
    onClearFilters();
  }, [onClearFilters]);

  const handleSelect = useCallback(
    (key: keyof PropertySearchParams, value: string) => {
      setLocalFilters(prev => ({
        ...prev,
        [key]: prev[key] === value ? undefined : value,
      }));
    },
    [],
  );

  return (
    <Modal visible={visible} transparent={true} onRequestClose={handleClose}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={handleClose}
          />
          <Animated.View
            style={[
              styles.filterModal,
              {
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              <TouchableWithoutFeedback>
                <View style={styles.filterContent}>
                  <FilterOption
                    label={t('filterModal.labels.propertyType')}
                    options={propertyTypes}
                    selectedValue={filters.propertyTypes}
                    onSelect={value => handleSelect('propertyTypes', value)}
                  />

                  <FilterOption
                    label={t('filterModal.labels.bhkType')}
                    options={bhkTypes}
                    selectedValue={filters.bhkType}
                    onSelect={value => handleSelect('bhkType', value)}
                  />

                  <FilterOption
                    label={t('filterModal.labels.furnishing')}
                    options={furnishTypes}
                    selectedValue={filters.furnishing}
                    onSelect={value => handleSelect('furnishing', value)}
                  />

                  <FilterOption
                    label={t('filterModal.labels.city')}
                    options={cities}
                    selectedValue={filters.city}
                    onSelect={value => handleSelect('city', value)}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>

            <View style={styles.filterActions}>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearAllFilters}>
                  <Text style={styles.clearButtonText}>{t('filterModal.buttons.clearAll')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  !haveFiltersChanged && styles.disabledButton,
                ]}
                onPress={handleApplyFilters}
                disabled={!haveFiltersChanged}>
                <Text
                  style={[
                    styles.applyButtonText,
                    !haveFiltersChanged && styles.disabledButtonText,
                  ]}>
                  {t('filterModal.buttons.applyFilters')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    position: 'relative' as const,
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' as const,
  },
  overlayTouchable: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%' as const,
  },
  filterHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  closeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold' as const,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  filterActions: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600' as const,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600' as const,
  },
  disabledButtonText: {
    color: '#999',
  },
};

export default FilterModal;
