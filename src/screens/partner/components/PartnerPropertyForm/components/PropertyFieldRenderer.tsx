import React from 'react';
import {Text} from 'react-native';
import {PartnerPropertyFormType} from '../../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../../context/MasterProvider';
import FilterOption from '../../../../../components/FilterOption';
import {MaterialTextInput} from '../../../../../components/MaterialTextInput';
import {formatCurrency} from '../../../../../utils/currency';
import { convertToMasterDetailModel } from '../../../../../utils/formUtils';

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
              : formInput.propertyForType === 'Residential'
              ? 'Residential'
              : 'Commercial'
          }
          onSelect={value => {
            // If the same value is selected again, deselect it
            if (formInput.propertyForType === value) {
              handleInputChange('propertyForType', null);
            } else {
              // Otherwise set the new value
              handleInputChange('propertyForType', value);
            }
          }}
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
          label="Area Unit"
          options={masterData?.AreaUnit || []}
          selectedValue={formInput.lmUnit}
          onSelect={value => handleFieldSelect('lmUnit', value)}
        />
      );

    case 'propertyAge':
      return (
        <FilterOption
          key={field}
          label="Age of Property"
          options={convertToMasterDetailModel([
            '0-5 Yrs',
            '6-10 Yrs',
            '11-15 Yrs',
            '16-20 Yrs',
            '20+ Yrs',
          ])}
          selectedValue={formInput.propertyAge}
          onSelect={value => handleFieldSelect('propertyAge', value)}
        />
      );

    case 'gatedSecurity':
      return (
        <FilterOption
          key={field}
          label="Gated Community Security"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.gatedSecurity === null
              ? null
              : formInput.gatedSecurity
              ? 'Yes'
              : 'No'
          }
          onSelect={value =>
            handleInputChange('gatedSecurity', value === 'Yes')
          }
        />
      );

    case 'surveillanceCameras':
      return (
        <FilterOption
          key={field}
          label="Surveillance"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.surveillanceCameras === null
              ? null
              : formInput.surveillanceCameras
              ? 'Yes'
              : 'No'
          }
          onSelect={value => toggleBooleanField('surveillanceCameras', value)}
        />
      );

    case 'alarmSystem':
      return (
        <FilterOption
          key={field}
          label="Alarm System"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.alarmSystem === null
              ? null
              : formInput.alarmSystem
              ? 'Yes'
              : 'No'
          }
          onSelect={value => toggleBooleanField('alarmSystem', value)}
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
          label="Long Description"
          mode="outlined"
          placeholder="Enter a detailed description"
          multiline
          numberOfLines={5}
        />
      );

    case 'bhkType':
      return (
        <FilterOption
          key={field}
          label="Configuration"
          options={masterData?.BhkType || []}
          selectedValue={formInput.bhkType}
          onSelect={value => handleFieldSelect('bhkType', value)}
        />
      );

    case 'ceilingHeight':
      return (
        <MaterialTextInput
          key={field}
          field="ceilingHeight"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Ceiling Height"
          mode="outlined"
          placeholder="Enter ceiling height"
        />
      );

    case 'constructionDone':
      return (
        <FilterOption
          key={field}
          label="Any Construction"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.constructionDone === null
              ? null
              : formInput.constructionDone
              ? 'Yes'
              : 'No'
          }
          onSelect={value => toggleBooleanField('constructionDone', value)}
        />
      );

    case 'boundaryWall':
      return (
        <FilterOption
          key={field}
          label="Boundary"
          options={convertToMasterDetailModel(['Yes', 'No'])}
          selectedValue={
            formInput.boundaryWall === null
              ? null
              : formInput.boundaryWall
              ? 'Yes'
              : 'No'
          }
          onSelect={value => toggleBooleanField('boundaryWall', value)}
        />
      );

    case 'openSide':
      return (
        <FilterOption
          key={field}
          label="No. of Open Side"
          options={convertToMasterDetailModel(['One', 'Two', 'Three', 'Four'])}
          selectedValue={formInput.openSide}
          onSelect={value => handleFieldSelect('openSide', value)}
        />
      );

    default:
      return null;
  }
};

export default PropertyFieldRenderer;
