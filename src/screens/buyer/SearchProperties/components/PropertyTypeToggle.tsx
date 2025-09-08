import React from 'react';
import {ScrollView} from 'react-native';
import {Chip} from 'react-native-paper';
import GetIcon from '../../../../components/GetIcon';
import {PropertyFor} from '../../../../constants/MasterDetails';
import Colors from '../../../../constants/Colors';
import {useTranslation} from 'react-i18next';

interface PropertyTypeToggleProps {
  propertyForFilter:
    | typeof PropertyFor.SALE
    | typeof PropertyFor.RENT
    | typeof PropertyFor.OTHERS
    | 'all';
  onFilterChange: (
    filter:
      | typeof PropertyFor.SALE
      | typeof PropertyFor.RENT
      | typeof PropertyFor.OTHERS
      | 'all',
  ) => void;
}

const CheckIcon = () => (
  <GetIcon iconName="checkmark" size={16} color="white" />
);

const PropertyTypeToggle: React.FC<PropertyTypeToggleProps> = ({
  propertyForFilter,
  onFilterChange,
}) => {
  const {t} = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.propertyTypeToggleScroll}
      contentContainerStyle={styles.propertyTypeToggle}>
      <Chip
        mode="outlined"
        selected={propertyForFilter === 'all'}
        onPress={() => onFilterChange('all')}
        style={[
          styles.chip,
          propertyForFilter === 'all'
            ? styles.chipSelected
            : styles.chipUnselected,
        ]}
        textStyle={[
          styles.chipText,
          propertyForFilter === 'all'
            ? styles.chipTextSelected
            : styles.chipTextUnselected,
        ]}
        icon={propertyForFilter === 'all' ? CheckIcon : undefined}>
        {t('propertyTypeToggle.all')}
      </Chip>
      <Chip
        mode="outlined"
        selected={propertyForFilter === PropertyFor.SALE}
        onPress={() => onFilterChange(PropertyFor.SALE)}
        style={[
          styles.chip,
          propertyForFilter === PropertyFor.SALE
            ? styles.chipSelected
            : styles.chipUnselected,
        ]}
        textStyle={[
          styles.chipText,
          propertyForFilter === PropertyFor.SALE
            ? styles.chipTextSelected
            : styles.chipTextUnselected,
        ]}
        icon={propertyForFilter === PropertyFor.SALE ? CheckIcon : undefined}>
        {t('propertyTypeToggle.forSale')}
      </Chip>
      <Chip
        mode="outlined"
        selected={propertyForFilter === PropertyFor.RENT}
        onPress={() => onFilterChange(PropertyFor.RENT)}
        style={[
          styles.chip,
          propertyForFilter === PropertyFor.RENT
            ? styles.chipSelected
            : styles.chipUnselected,
        ]}
        textStyle={[
          styles.chipText,
          propertyForFilter === PropertyFor.RENT
            ? styles.chipTextSelected
            : styles.chipTextUnselected,
        ]}
        icon={propertyForFilter === PropertyFor.RENT ? CheckIcon : undefined}>
        {t('propertyTypeToggle.forRent')}
      </Chip>
      <Chip
        mode="outlined"
        selected={propertyForFilter === PropertyFor.OTHERS}
        onPress={() => onFilterChange(PropertyFor.OTHERS)}
        style={[
          styles.chip,
          propertyForFilter === PropertyFor.OTHERS
            ? styles.chipSelected
            : styles.chipUnselected,
        ]}
        textStyle={[
          styles.chipText,
          propertyForFilter === PropertyFor.OTHERS
            ? styles.chipTextSelected
            : styles.chipTextUnselected,
        ]}
        icon={propertyForFilter === PropertyFor.OTHERS ? CheckIcon : undefined}>
        {t('propertyTypeToggle.others')}
      </Chip>
    </ScrollView>
  );
};

const styles = {
  propertyTypeToggleScroll: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  propertyTypeToggle: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    marginHorizontal: 0,
  },
  chipSelected: {
    backgroundColor: Colors.MT_PRIMARY_2,
    borderColor: Colors.MT_PRIMARY_2,
  },
  chipUnselected: {
    backgroundColor: 'white',
    borderColor: '#ddd',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  chipTextSelected: {
    color: 'white',
  },
  chipTextUnselected: {
    color: '#666',
  },
};

export default PropertyTypeToggle;
