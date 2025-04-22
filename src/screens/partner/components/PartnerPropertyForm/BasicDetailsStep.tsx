import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FormNavigationButtons from './components/FormNavigationButtons';
import {PartnerPropertyFormType} from '../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../context/MasterProvider';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import FilterOption from '../../../../components/FilterOption';
import {formatCurrency} from '../../../../utils/currency';

interface BasicDetailsStepProps {
  formInput: PartnerPropertyFormType;
  handleInputChange: (field: keyof PartnerPropertyFormType, value: any) => void;
  handleSelect: <K extends keyof PartnerPropertyFormType>(
    field: K,
    value: string,
  ) => void;
  onNext: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formInput,
  handleInputChange,
  handleSelect,
  onNext,
  onBack,
  showBackButton = false,
}) => {
  const {masterData} = useMaster();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldSelect = useCallback(
    (field: keyof PartnerPropertyFormType, value: string) => {
      handleSelect(field, value);
      // Clear error for this field when a value is selected
      if (errors[field]) {
        setErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [handleSelect, errors],
  );

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    // Check required fields
    if (!formInput.propertyName || formInput.propertyName.trim() === '') {
      newErrors.propertyName = 'Property name is required';
    }

    if (!formInput.sellerType) {
      newErrors.sellerType = 'Seller type is required';
    }

    if (!formInput.city) {
      newErrors.city = 'City is required';
    }

    if (!formInput.propertyFor) {
      newErrors.propertyFor = 'Property for is required';
    }

    if (!formInput.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (!formInput.location || formInput.location.trim() === '') {
      newErrors.location = 'Location is required';
    }

    if (!formInput.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formInput.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) {
      onNext();
    }
  };

  // Clear errors when input changes
  const handleTextInputChange = (
    field: keyof PartnerPropertyFormType,
    value: any,
  ) => {
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
    handleInputChange(field, value);
  };

  // Check if the form is valid
  const isNextEnabled: boolean =
    Boolean(formInput.propertyName) &&
    formInput.propertyName?.trim() !== '' &&
    Boolean(formInput.sellerType) &&
    Boolean(formInput.city) &&
    Boolean(formInput.propertyFor) &&
    Boolean(formInput.propertyType) &&
    Boolean(formInput.location) &&
    formInput.location?.trim() !== '' &&
    Boolean(formInput.price) &&
    Number(formInput.price ?? 0) > 0;

  return (
    <View style={styles.container}>
      <MaterialTextInput
        field="propertyName"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Property Name*"
        mode="outlined"
        placeholder="Enter a property name"
        errorMessage={errors.propertyName}
      />

      <FilterOption
        label="Seller Type*"
        options={masterData?.SellerType || []}
        selectedValue={formInput.sellerType}
        onSelect={value => handleFieldSelect('sellerType', value)}
        error={errors.sellerType}
      />

      <FilterOption
        label="City*"
        options={masterData?.ProjectLocation || []}
        selectedValue={formInput.city}
        onSelect={value => handleFieldSelect('city', value)}
        error={errors.city}
      />

      <FilterOption
        label="Property For*"
        options={masterData?.PropertyFor || []}
        selectedValue={formInput.propertyFor}
        onSelect={value => handleFieldSelect('propertyFor', value)}
        error={errors.propertyFor}
      />

      <FilterOption
        label="Property Type*"
        options={masterData?.PropertyType || []}
        selectedValue={formInput.propertyType}
        onSelect={value => handleFieldSelect('propertyType', value)}
        error={errors.propertyType}
      />

      <MaterialTextInput
        field="location"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Location*"
        mode="outlined"
        placeholder="Enter location details"
        errorMessage={errors.location}
      />

      <MaterialTextInput
        field="price"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Price*"
        mode="outlined"
        placeholder="Enter property price"
        keyboardType="number-pad"
        errorMessage={errors.price}
        rightComponent={<Text>{formatCurrency(formInput.price)}</Text>}
      />

      {/* Navigation buttons */}
      <FormNavigationButtons
        onNext={handleNext}
        onBack={onBack}
        showBackButton={showBackButton}
        isNextEnabled={isNextEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

export default BasicDetailsStep;
