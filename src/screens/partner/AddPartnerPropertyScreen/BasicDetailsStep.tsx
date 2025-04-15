import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {PartnerPropertyFormType} from '../../../schema/PartnerPropertyFormSchema';
import FilterOption from '../../../components/FilterOption';
import {useMaster} from '../../../context/MasterProvider';
import FormNavigationButtons from './components/FormNavigationButtons';

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

  const handleFieldSelect = useCallback(
    (field: keyof PartnerPropertyFormType, value: string) => {
      handleSelect(field, value);
    },
    [handleSelect],
  );

  // Check if the required property type is selected
  const isNextEnabled =
    formInput.propertyType !== null &&
    formInput.propertyType !== undefined &&
    formInput.propertyType !== '';

  return (
    <View style={styles.container}>
      <MaterialTextInput
        field="propertyName"
        formInput={formInput}
        setFormInput={handleInputChange}
        label="Property Name"
        mode="outlined"
        placeholder="Enter a property name"
      />

      <FilterOption
        label="Seller Type"
        options={masterData?.SellerType || []}
        selectedValue={formInput.sellerType}
        onSelect={value => handleFieldSelect('sellerType', value)}
      />

      <FilterOption
        label="City"
        options={masterData?.ProjectLocation || []}
        selectedValue={formInput.city}
        onSelect={value => handleFieldSelect('city', value)}
      />

      <FilterOption
        label="Property For"
        options={masterData?.PropertyFor || []}
        selectedValue={formInput.propertyFor}
        onSelect={value => handleFieldSelect('propertyFor', value)}
      />

      <FilterOption
        label="Property Type"
        options={masterData?.PropertyType || []}
        selectedValue={formInput.propertyType}
        onSelect={value => handleFieldSelect('propertyType', value)}
      />

      {/* Navigation buttons */}
      <FormNavigationButtons
        onNext={onNext}
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
