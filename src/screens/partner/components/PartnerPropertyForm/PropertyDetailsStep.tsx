import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropertyFieldRenderer from './components/PropertyFieldRenderer';
import FormNavigationButtons from './components/FormNavigationButtons';
import { PartnerPropertyFormType } from '../../../../schema/PartnerPropertyFormSchema';
import { propertyTypeFieldMappings } from '../../../../utils/property-type-field-mappings';

interface PropertyDetailsStepProps {
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

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  formInput,
  handleInputChange,
  handleSelect,
  onNext,
  onBack,
  showBackButton = false,
}) => {
  const handleFieldSelect = useCallback(
    (field: keyof PartnerPropertyFormType, value: string) => {
      handleSelect(field, value);
    },
    [handleSelect],
  );

  const toggleBooleanField = (
    field: keyof PartnerPropertyFormType,
    value: string | null,
  ) => {
    // If already selected, deselect (set to null)
    if (
      (formInput[field] === true && value === 'Yes') ||
      (formInput[field] === false && value === 'No')
    ) {
      handleInputChange(field, null);
    }
    // Otherwise set the appropriate boolean value
    else if (value === 'Yes') {
      handleInputChange(field, true);
    } else if (value === 'No') {
      handleInputChange(field, false);
    }
  };

  // Determine which fields to render based on propertyType
  const fieldsToRender = useMemo(() => {
    const propertyType = formInput.propertyType;
    if (!propertyType) {
      return [];
    }

    return (
      propertyTypeFieldMappings[
        propertyType as keyof typeof propertyTypeFieldMappings
      ] || []
    );
  }, [formInput.propertyType]);

  // Common fields that appear in all property types
  const commonFields = useMemo(
    () => [
      'location',
      'zipCode',
      'price',
      'area',
      'lmUnit',
      'shortDescription',
      'longDescription',
    ],
    [],
  );

  // Determine if form is valid for next step
  const isNextEnabled = useMemo(() => {
    if (!formInput.propertyType) {
      return false;
    }

    // Basic validation - customize as needed
    return !!(formInput.price && formInput.area);
  }, [formInput]);

  // Only render fields that are visible and relevant to the current property type
  const visibleFields = useMemo(() => {
    if (!formInput.propertyType) {
      return [];
    }

    // Combine property-specific fields with common fields
    return [...fieldsToRender, ...commonFields];
  }, [fieldsToRender, commonFields, formInput.propertyType]);

  return (
    <View style={styles.container}>
      {formInput.propertyType ? (
        <View>
          <View style={styles.fieldsContainer}>
            {/* Key change: Map and render fields differently */}
            {visibleFields.map(field => {
              // Render the field and capture the result
              const fieldComponent = (
                <PropertyFieldRenderer
                  key={field}
                  field={field}
                  formInput={formInput}
                  handleInputChange={handleInputChange}
                  handleFieldSelect={handleFieldSelect}
                  toggleBooleanField={toggleBooleanField}
                />
              );

              // Only wrap and render if fieldComponent isn't null
              return fieldComponent ? (
                <View key={field} style={styles.fieldWrapper}>
                  {fieldComponent}
                </View>
              ) : null;
            })}
          </View>

          {/* Navigation buttons */}
          <FormNavigationButtons
            onNext={onNext}
            onBack={onBack}
            showBackButton={showBackButton}
            isNextEnabled={isNextEnabled}
          />
        </View>
      ) : (
        <View style={styles.noSelectionContainer}>
          <Text style={styles.noSelectionText}>
            Please select a Property Type in the previous step.
          </Text>
          {onBack && (
            <FormNavigationButtons
              onBack={onBack}
              showBackButton={true}
              nextButtonText="Go Back"
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldsContainer: {
    gap: 8,
  },
  fieldWrapper: {
    marginBottom: 8,
  },
  noSelectionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PropertyDetailsStep;
