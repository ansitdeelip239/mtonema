import React from 'react';
import {Text} from 'react-native';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';
import FilterOption from '../../../../components/FilterOption';
import {PartnerPropertyFormType} from '../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../context/MasterProvider';
import {convertToMasterDetailModel} from '../../../../utils/formUtils';
import {formatCurrency} from '../../../../utils/currency';

interface PropertyFieldRendererProps {
  field: string;
  formInput: PartnerPropertyFormType;
  handleInputChange: (field: keyof PartnerPropertyFormType, value: any) => void;
  handleFieldSelect: (
    field: keyof PartnerPropertyFormType,
    value: string,
  ) => void;
  toggleBooleanField: (
    field: keyof PartnerPropertyFormType,
    value: string | null,
  ) => void;
}

const PropertyFieldRenderer: React.FC<PropertyFieldRendererProps> = ({
  field,
  formInput,
  handleInputChange,
  handleFieldSelect,
  toggleBooleanField,
}) => {
  const {masterData} = useMaster();

  switch (field) {
    case 'propertyForType':
      return (
        <FilterOption
          key={field}
          label="Property Category"
          options={convertToMasterDetailModel(['Residential', 'Commercial'])}
          selectedValue={
            formInput.propertyForType === null
              ? null
              : formInput.propertyForType
              ? 'Residential'
              : 'Commercial'
          }
          onSelect={value => handleFieldSelect('propertyForType', value)}
        />
      );
    case 'readyToMove':
      return (
        <FilterOption
          key={field}
          label="Ready To Move"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.readyToMove === null
              ? null
              : formInput.readyToMove
              ? 'Yes'
              : 'No'
          }
          onSelect={value => toggleBooleanField('readyToMove', value)}
        />
      );

    case 'lifts':
      return (
        <FilterOption
          key={field}
          label="Lift Available"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.lifts === null ? null : formInput.lifts ? 'Yes' : 'No'
          }
          onSelect={value => toggleBooleanField('lifts', value)}
        />
      );

    case 'pantry':
      return (
        <FilterOption
          key={field}
          label="Pantry"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.pantry === null ? null : formInput.pantry ? 'Yes' : 'No'
          }
          onSelect={value => toggleBooleanField('pantry', value)}
        />
      );

    case 'floor':
      return (
        <MaterialTextInput
          key={field}
          field="floor"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Floor"
          mode="outlined"
          placeholder="Enter floor number"
          keyboardType="number-pad"
        />
      );

    case 'furnishing':
      return (
        <FilterOption
          key={field}
          label="Furnished Type"
          options={masterData?.FurnishType || []}
          selectedValue={formInput.furnishing}
          onSelect={value => handleFieldSelect('furnishing', value)}
        />
      );

    case 'parking':
      return (
        <FilterOption
          key={field}
          label="Car Parking"
          options={convertToMasterDetailModel([
            'Yes-Shaded',
            'Yes-Unshaded',
            'No',
          ])}
          selectedValue={formInput.parking}
          onSelect={value => handleFieldSelect('parking', value)}
        />
      );

    case 'facing':
      return (
        <FilterOption
          key={field}
          label="Direction of Facing"
          options={masterData?.Facing || []}
          selectedValue={formInput.facing}
          onSelect={value => handleFieldSelect('facing', value)}
        />
      );

    case 'location':
      return (
        <MaterialTextInput
          key={field}
          field="location"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Location"
          mode="outlined"
          placeholder="Enter property location"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
        />
      );

    case 'zipCode':
      return (
        <MaterialTextInput
          key={field}
          field="zipCode"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Zip Code"
          mode="outlined"
          placeholder="Enter ZIP code"
          keyboardType="number-pad"
        />
      );

    case 'price':
      return (
        <MaterialTextInput
          key={field}
          field="price"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Price"
          mode="outlined"
          placeholder="Enter property price"
          keyboardType="number-pad"
          rightComponent={<Text>{formatCurrency(formInput.price)}</Text>}
        />
      );

    case 'area':
      return (
        <MaterialTextInput
          key={field}
          field="area"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Property Area"
          mode="outlined"
          placeholder="Enter property area"
          keyboardType="number-pad"
        />
      );

    case 'lmUnit':
      return (
        <FilterOption
          key={field}
          label="Property Unit"
          options={masterData?.AreaUnit || []}
          selectedValue={formInput.lmUnit}
          onSelect={value => handleFieldSelect('lmUnit', value)}
        />
      );

    case 'shortDescription':
      return (
        <MaterialTextInput
          key={field}
          field="shortDescription"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Short Description"
          mode="outlined"
          placeholder="Enter a short description"
          multiline
          numberOfLines={3}
        />
      );

    case 'longDescription':
      return (
        <MaterialTextInput
          key={field}
          field="longDescription"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Property Description"
          mode="outlined"
          placeholder="Enter detailed property description"
          multiline
          numberOfLines={5}
        />
      );

    // Add all other field types...

    default:
      return null;
  }
};

export default PropertyFieldRenderer;
