import React, {useCallback, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FormNavigationButtons from './components/FormNavigationButtons';
import partnerPropertyFormSchema, {
  PartnerPropertyFormType,
} from '../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../context/MasterProvider';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import FilterOption from '../../../../components/FilterOption';
import {formatCurrency} from '../../../../utils/currency';
import {z} from 'zod';

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [shouldShowErrors, setShouldShowErrors] = useState(false);

  // Validate and show errors while typing
  const validateField = useCallback(
    (field: keyof PartnerPropertyFormType, value: any) => {
      try {
        // Create a partial schema with just the field being validated
        const fieldSchema = z.object({
          [field]: partnerPropertyFormSchema.shape[field],
        });

        fieldSchema.parse({[field]: value});
        setErrors(prev => ({...prev, [field]: ''}));
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => err.path[0] === field);
          if (fieldError && shouldShowErrors) {
            setErrors(prev => ({...prev, [field]: fieldError.message}));
          }
        }
      }
    },
    [shouldShowErrors],
  );

  // Perform silent validation for next button
  const validateFormSilently = useCallback(() => {
    try {
      const step1Fields = [
        'propertyName',
        'sellerType',
        'city',
        'propertyFor',
        'propertyType',
        'location',
        'price',
      ];

      const step1Data = Object.fromEntries(
        step1Fields.map(field => [
          field,
          formInput[field as keyof PartnerPropertyFormType],
        ]),
      );

      partnerPropertyFormSchema.parse(step1Data);
      return true;
    } catch (error) {
      return false;
    }
  }, [formInput]);

  useEffect(() => {
    const isValid = validateFormSilently();
    setIsFormValid(isValid);

    // If all fields are empty, reset all states
    const allEmpty = Object.values(formInput).every(
      value => value === '' || value === null || value === undefined,
    );

    if (allEmpty) {
      setErrors({});
      setAttemptedSubmit(false);
      setShouldShowErrors(false);
    }
  }, [formInput, validateFormSilently]);

  const handleFieldSelect = useCallback(
    (field: keyof PartnerPropertyFormType, value: string) => {
      handleSelect(field, value);
      validateField(field, value);
    },
    [handleSelect, validateField],
  );

  const handleTextInputChange = (
    field: keyof PartnerPropertyFormType,
    value: any,
  ) => {
    handleInputChange(field, value);
    setShouldShowErrors(true);
    validateField(field, value);
  };

  const handleNext = () => {
    setAttemptedSubmit(true);
    setShouldShowErrors(true);

    try {
      const step1Fields = [
        'propertyName',
        'sellerType',
        'city',
        'propertyFor',
        'propertyType',
        'location',
        'price',
      ];

      const step1Data = Object.fromEntries(
        step1Fields.map(field => [
          field,
          formInput[field as keyof PartnerPropertyFormType],
        ]),
      );

      partnerPropertyFormSchema.parse(step1Data);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // Get error message based on validation state
  const getErrorMessage = (field: keyof PartnerPropertyFormType) => {
    if (shouldShowErrors || attemptedSubmit) {
      return errors[field];
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <MaterialTextInput
        field="propertyName"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Property Name*"
        mode="outlined"
        placeholder="Enter a property name"
        errorMessage={getErrorMessage('propertyName')}
      />

      <FilterOption
        label="Seller Type*"
        options={masterData?.SellerType || []}
        selectedValue={formInput.sellerType}
        onSelect={value => handleFieldSelect('sellerType', value)}
        error={getErrorMessage('sellerType')}
      />

      <FilterOption
        label="City*"
        options={masterData?.ProjectLocation || []}
        selectedValue={formInput.city}
        onSelect={value => handleFieldSelect('city', value)}
        error={getErrorMessage('city')}
      />

      <FilterOption
        label="Property For*"
        options={masterData?.PropertyFor || []}
        selectedValue={formInput.propertyFor}
        onSelect={value => handleFieldSelect('propertyFor', value)}
        error={getErrorMessage('propertyFor')}
      />

      <FilterOption
        label="Property Type*"
        options={masterData?.PropertyType || []}
        selectedValue={formInput.propertyType}
        onSelect={value => handleFieldSelect('propertyType', value)}
        error={getErrorMessage('propertyType')}
      />

      <MaterialTextInput
        field="location"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Location*"
        mode="outlined"
        placeholder="Enter location details"
        errorMessage={getErrorMessage('location')}
      />

      <MaterialTextInput
        field="price"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Price*"
        mode="outlined"
        placeholder="Enter property price"
        keyboardType="number-pad"
        errorMessage={getErrorMessage('price')}
        rightComponent={<Text>{formatCurrency(formInput.price)}</Text>}
      />

      {/* Navigation buttons */}
      <FormNavigationButtons
        onNext={handleNext}
        onBack={onBack}
        showBackButton={showBackButton}
        isNextEnabled={isFormValid}
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
