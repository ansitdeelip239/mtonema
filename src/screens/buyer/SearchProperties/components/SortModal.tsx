import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList, Animated} from 'react-native';
import Colors from '../../../../constants/Colors';
import {SortBy} from '../../../../constants/MasterDetails';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSort: (sortBy: string) => void;
  currentSort: string;
}

const sortOptions = [
  { label: 'Newest First', value: SortBy.NEWEST },
  { label: 'Price: Low to High', value: SortBy.PRICE_LOW_TO_HIGH },
  { label: 'Price: High to Low', value: SortBy.PRICE_HIGH_TO_LOW },
  { label: 'Area: Low to High', value: SortBy.AREA_LOW_TO_HIGH },
  { label: 'Area: High to Low', value: SortBy.AREA_HIGH_TO_LOW },
];

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onSelectSort,
  currentSort,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isVisible, setIsVisible] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
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
    } else if (isVisible) {
      // Start exit animations when modal should close
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
        // After exit animation completes, hide the modal
        setIsVisible(false);
      });
    }
  }, [visible, isVisible, fadeAnim, slideAnim]);

  const handleSortSelect = (sortValue: string) => {
    onSelectSort(sortValue);
    handleClose();
  };

  const handleOverlayPress = () => {
    handleClose();
  };

  const handleClose = () => {
    // Start exit animations
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
      // After exit animation completes, call onClose
      setIsVisible(false);
      onClose();
    });
  };

  const renderSortOption = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        currentSort === item.value && styles.selectedSortOption,
      ]}
      onPress={() => handleSortSelect(item.value)}>
      <Text
        style={[
          styles.sortOptionText,
          currentSort === item.value && styles.selectedSortOptionText,
        ]}>
        {item.label}
      </Text>
      {currentSort === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={handleClose}>
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
            onPress={handleOverlayPress}
          />
          <Animated.View
            style={[
              styles.sortModal,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <View style={styles.sortHeader}>
              <Text style={styles.sortTitle}>Sort By</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              style={styles.sortOptionsList}
            />
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
  sortModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%' as const,
  },
  sortHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  closeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold' as const,
  },
  sortOptionsList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sortOption: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedSortOption: {
    backgroundColor: Colors.MT_PRIMARY_1 + '20', // 20% opacity
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500' as const,
  },
  selectedSortOptionText: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: '600' as const,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold' as const,
  },
};

export default SortModal;
