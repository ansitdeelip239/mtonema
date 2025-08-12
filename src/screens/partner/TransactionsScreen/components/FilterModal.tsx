import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {TransactionFilters} from '../../../../types';
import GetIcon from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';

interface FilterModalProps {
  visible: boolean;
  filters: TransactionFilters;
  availableStatuses: string[];
  availableMethods: string[];
  onApply: (filters: TransactionFilters) => void;
  onClose: () => void;
  onReset: () => void;
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const FilterButton = ({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterButton, selected && styles.filterButtonSelected]}
    onPress={onPress}>
    <Text
      style={[
        styles.filterButtonText,
        selected && styles.filterButtonTextSelected,
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const FilterModal = React.memo<FilterModalProps>(
  ({
    visible,
    filters,
    availableStatuses,
    availableMethods,
    onApply,
    onClose,
    onReset,
  }) => {
    const [localFilters, setLocalFilters] =
      useState<TransactionFilters>(filters);

    useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <GetIcon iconName="clear" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Filter Transactions</Text>
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            <FilterSection title="Search">
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, email, or transaction ID"
                value={localFilters.searchQuery || ''}
                onChangeText={text =>
                  setLocalFilters(prev => ({...prev, searchQuery: text}))
                }
              />
            </FilterSection>

            <FilterSection title="Status">
              <View style={styles.filterGrid}>
                <FilterButton
                  title="All"
                  selected={
                    !localFilters.status || localFilters.status === 'all'
                  }
                  onPress={() =>
                    setLocalFilters(prev => ({...prev, status: 'all'}))
                  }
                />
                {availableStatuses.map(status => (
                  <FilterButton
                    key={status}
                    title={status.charAt(0).toUpperCase() + status.slice(1)}
                    selected={localFilters.status === status}
                    onPress={() => setLocalFilters(prev => ({...prev, status}))}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Payment Method">
              <View style={styles.filterGrid}>
                <FilterButton
                  title="All"
                  selected={
                    !localFilters.method || localFilters.method === 'all'
                  }
                  onPress={() =>
                    setLocalFilters(prev => ({...prev, method: 'all'}))
                  }
                />
                {availableMethods.map(method => (
                  <FilterButton
                    key={method}
                    title={method.toUpperCase()}
                    selected={localFilters.method === method}
                    onPress={() => setLocalFilters(prev => ({...prev, method}))}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Sort By">
              <View style={styles.filterGrid}>
                {[
                  {key: 'transactionDate', label: 'Date'},
                  {key: 'amount', label: 'Amount'},
                  {key: 'status', label: 'Status'},
                ].map(sort => (
                  <FilterButton
                    key={sort.key}
                    title={sort.label}
                    selected={localFilters.sortBy === sort.key}
                    onPress={() =>
                      setLocalFilters(prev => ({...prev, sortBy: sort.key}))
                    }
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Sort Order">
              <View style={styles.filterGrid}>
                <FilterButton
                  title="Newest First"
                  selected={localFilters.sortOrder === 'desc'}
                  onPress={() =>
                    setLocalFilters(prev => ({...prev, sortOrder: 'desc'}))
                  }
                />
                <FilterButton
                  title="Oldest First"
                  selected={localFilters.sortOrder === 'asc'}
                  onPress={() =>
                    setLocalFilters(prev => ({...prev, sortOrder: 'asc'}))
                  }
                />
              </View>
            </FilterSection>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => onApply(localFilters)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resetText: {
    fontSize: 16,
    color: Colors.MT_PRIMARY_2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonSelected: {
    backgroundColor: Colors.MT_PRIMARY_2,
    borderColor: Colors.MT_PRIMARY_2,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    backgroundColor: Colors.MT_PRIMARY_2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
