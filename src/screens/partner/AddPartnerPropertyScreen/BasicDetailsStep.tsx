import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import { PropertyFormData } from './types';

interface BasicDetailsStepProps {
  formInput: PropertyFormData;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formInput,
  handleInputChange,
}) => {
  return (
    <View style={styles.container}>
      <MaterialTextInput
        field="propertyTitle"
        formInput={formInput}
        setFormInput={handleInputChange}
        label="Property Title"
        mode="outlined"
        placeholder="Enter a descriptive title"
      />

      <MaterialTextInput
        field="propertyType"
        formInput={formInput}
        setFormInput={handleInputChange}
        label="Property Type"
        mode="outlined"
        placeholder="Apartment, Villa, etc."
      />

      <MaterialTextInput
        field="propertyLocation"
        formInput={formInput}
        setFormInput={handleInputChange}
        label="Location"
        mode="outlined"
        placeholder="Property location"
      />
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
});

export default BasicDetailsStep;
