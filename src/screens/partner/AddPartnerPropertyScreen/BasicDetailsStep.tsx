import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {PartnerPropertyFormType} from '../../../schema/PartnerPropertyFormSchema';
import FilterOption from '../../../components/FilterOption';
import {useMaster} from '../../../context/MasterProvider';
import Colors from '../../../constants/Colors';

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
      // validateField(field, value);
      handleSelect(field, value);
    },
    [handleSelect],
  );

  // Check if the required property type is selected
  // Improve validation to handle all possible invalid states
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
      <View style={styles.buttonsContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            isNextEnabled ? styles.nextButton : styles.disabledButton,
            showBackButton ? {} : styles.fullWidthButton,
          ]}
          onPress={isNextEnabled ? onNext : undefined}
          disabled={!isNextEnabled}>
          <Text
            style={
              isNextEnabled ? styles.nextButtonText : styles.disabledButtonText
            }>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: Colors.main,
    marginLeft: 'auto',
  },
  fullWidthButton: {
    flex: 1,
  },
  backButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    marginLeft: 'auto',
  },
  disabledButtonText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BasicDetailsStep;
