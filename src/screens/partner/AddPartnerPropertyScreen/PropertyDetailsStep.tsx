import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {PartnerPropertyFormType} from '../../../schema/PartnerPropertyFormSchema';
import FilterOption from '../../../components/FilterOption';
import {useMaster} from '../../../context/MasterProvider';
import Colors from '../../../constants/Colors';
import {convertToMasterDetailModel} from '../../../utils/formUtils';
import {formatCurrency} from '../../../utils/currency';

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
  const {masterData} = useMaster();

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

    // Define field mappings for each property type (specific fields only)
    const fieldMappings = {
      CoWorking: [
        'propertyForType',
        'readyToMove',
        'lifts',
        'pantry',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      FOCP: [
        'propertyForType',
        'lifts',
        'bhkType',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      'Farm House': [
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
        'furnishing',
        'parking',
        'facing',
      ],
      Flat: [
        'propertyForType',
        'readyToMove',
        'lifts',
        'bhkType',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      'Independent House': [
        'propertyForType',
        'readyToMove',
        'lifts',
        'bhkType',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      Office: [
        'propertyForType',
        'readyToMove',
        'lifts',
        'pantry',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      'PG/Hostel': [
        'propertyForType',
        'readyToMove',
        'lifts',
        'bhkType',
        'floor',
        'furnishing',
        'parking',
        'facing',
      ],
      Plot: [
        'propertyForType',
        'constructionDone',
        'boundaryWall',
        'openSide',
        'facing',
      ],
      'Retail Shop': [
        'propertyForType',
        'readyToMove',
        'lifts',
        'ceilingHeight',
        'floor',
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
        'parking',
        'facing',
      ],
      Shop: [
        'propertyForType',
        'readyToMove',
        'lifts',
        'ceilingHeight',
        'floor',
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
        'parking',
        'facing',
      ],
      Villa: [
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
        'parking',
        'facing',
      ],
      Warehouse: [
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
      ],
      Others: [
        'propertyAge',
        'gatedSecurity',
        'surveillanceCameras',
        'alarmSystem',
      ],
    };

    // Return fields for the selected property type or empty array if type not found
    return fieldMappings[propertyType as keyof typeof fieldMappings] || [];
  }, [formInput.propertyType]);

  // Common fields that appear in all property types
  const commonFields = [
    'location',
    'zipCode',
    'price',
    'area',
    'lmUnit',
    'shortDescription',
    'longDescription',
  ];

  // Determine if form is valid for next step
  const isNextEnabled = useMemo(() => {
    if (!formInput.propertyType) {
      return false;
    }

    // Basic validation - customize as needed
    if (!formInput.price) {
      return false;
    }
    if (!formInput.area) {
      return false;
    }

    return true;
  }, [formInput]);

  // Render the appropriate form field based on field type
  const renderField = (field: string) => {
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
            options={convertToMasterDetailModel([
              'One',
              'Two',
              'Three',
              'Four',
            ])}
            selectedValue={formInput.openSide}
            onSelect={value => handleFieldSelect('openSide', value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {formInput.propertyType ? (
        <View>
          <View style={styles.fieldsContainer}>
            {/* Render property-specific fields */}
            {fieldsToRender.map(field => (
              <View key={field} style={styles.fieldWrapper}>
                {renderField(field)}
              </View>
            ))}

            {/* Render common fields */}
            {commonFields.map(field => (
              <View key={field} style={styles.fieldWrapper}>
                {renderField(field)}
              </View>
            ))}
          </View>

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
                  isNextEnabled
                    ? styles.nextButtonText
                    : styles.disabledButtonText
                }>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noSelectionContainer}>
          <Text style={styles.noSelectionText}>
            Please select a Property Type in the previous step.
          </Text>
          {onBack && (
            <TouchableOpacity
              style={[styles.button, styles.backButton, styles.fullWidthButton]}
              onPress={onBack}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
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
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Increased margin below title
  },
  fieldsContainer: {
    gap: 8, // Increased gap between field sections
  },
  fieldWrapper: {
    marginBottom: 8, // Space between fields
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32, // Increased margin above buttons
    paddingTop: 16, // Added padding to separate from fields
    borderTopWidth: 1, // Optional: adds a separator line
    borderTopColor: '#f0f0f0', // Light gray border
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
