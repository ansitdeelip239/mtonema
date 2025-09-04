import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import Colors from '../../../../constants/Colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContent}>
            <Text style={styles.comingSoonText}>Advanced filters coming soon!</Text>
            <Text style={styles.comingSoonSubtext}>
              Currently you can filter by property type (Sale/Rent) using the chips above.
            </Text>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' as const,
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
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
    lineHeight: 20,
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
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600' as const,
  },
};

export default FilterModal;
