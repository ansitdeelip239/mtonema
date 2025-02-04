import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {SegmentedButtons, Text, TextInput} from 'react-native-paper';
import {useMaster} from '../../../context/MasterProvider';
import Colors from '../../../constants/Colors';
import {FlatList} from 'react-native-gesture-handler';
import {MasterDetailModel} from '../../../types';
import {
  loadFormData,
  saveFormData,
} from '../../../utils/asyncStoragePropertyForm';
import {usePropertyForm} from '../../../context/PropertyFormContext';
import { MaterialTextInput } from '../../../components/MaterialTextInput';
import { formatCurrency } from '../../../utils/currency';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen2'>;
type PropertyType =
  | 'CoWorking'
  | 'FOCP'
  | 'Farm House'
  | 'Flat'
  | 'Independent House'
  | 'Office'
  | 'PG/Hostel'
  | 'Plot'
  | 'Retail Shop'
  | 'Shop'
  | 'Villa'
  | 'Warehouse';
const FormScreen2: React.FC<Props> = ({navigation}) => {
  const {masterData} = useMaster();
  const {
    formData,
    setFormData,
    isFormValid: isContextFormValid,
  } = usePropertyForm();
  const [values, setValue] = useState('Property info');
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [showAll, setShowAll] = useState<{[key: string]: boolean}>({
    PropertyType: false,
    Facing: false,
    FurnishType: false,
  });
  const initialChipsToShow = 2;

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadFormData();
      if (savedData) {
        setFormData(prevData => ({
          ...prevData,
          ...savedData,
        }));
      }
    };
    loadSavedData();
  }, [setFormData]);

  // Save form data whenever it changes
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  const handleNext = () => {
    setIsContinueClicked(true);
    navigation.navigate('FormScreen3');
  };

  const handleOptionPress = (key: keyof typeof formData, value: any) => {
    console.log('Handling option press:', key, value);
    setFormData(prevState => ({
      ...prevState,
      [key]: prevState[key] === value ? '' : value,
    }));
  };

  const isFormValid = () => {
    return isContextFormValid(2);

  };

  const renderOptionSection = (
    title: string,
    key: keyof typeof formData,
    data: MasterDetailModel[],
    isRequired: boolean = false,
  ) => {
    const displayedOptions = showAll[key]
      ? data
      : data.slice(0, initialChipsToShow);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {title} {isRequired && <Text style={styles.asterisk}>*</Text>}
        </Text>
        <View style={styles.optionsGrid}>
          {displayedOptions?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                formData[key] === item.ID && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(key, item.ID)}>
              <Text
                style={[
                  styles.optionText,
                  formData[key] === item.ID && styles.selectedOptionText,
                ]}>
                {item.MasterDetailName}
              </Text>
            </TouchableOpacity>
          ))}
          {data.length > initialChipsToShow && (
            <TouchableOpacity
              onPress={() => setShowAll(prev => ({...prev, [key]: !prev[key]}))}
              style={styles.moreButton}>
              <Text style={styles.moreButtonText}>
                {showAll[key] ? 'Less' : 'More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderSimpleOptionButtons = (
    title: string,
    field: keyof typeof formData,
    options: string[],
    isRequired: boolean = false,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} {isRequired && <Text style={styles.asterisk}>*</Text>}
      </Text>
      <View style={styles.optionsRow}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              formData[field] === option && styles.selectedOption,
            ]}
            onPress={() => handleOptionPress(field, option)}>
            <Text
              style={[
                styles.optionText,
                formData[field] === option && styles.selectedOptionText,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const propertyTypeFields: Record<PropertyType, string[]> = {
    CoWorking: [
      'Ready To Move',
      'Lift Available',
      'Pantry',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    FOCP: [
      'Lift Available',
      'Configuration',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    'Farm House': [
      'Age of Property',
      'Gated community security',
      'Surveillance',
      'Alarm System',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Flat: [
      'Ready To Move',
      'Lift Available',
      'Configuration',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    'Independent House': [
      'Ready To Move',
      'Lift Available',
      'Configuration',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Office: [
      'Ready To Move',
      'Lift Available',
      'Pantry',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    'PG/Hostel': [
      'Ready To Move',
      'Lift Available',
      'Configuration',
      'Floor',
      'Furnished Type',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Plot: [
      'Any Construction',
      'Boundary',
      'No. of Open Side',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    'Retail Shop': [
      'Ready To Move',
      'Lift Available',
      'Ceiling Height',
      'Floor',
      'Age of Property',
      'Security Personal',
      'Surveillance',
      'Alarm System',
      'car',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Shop: [
      'Ready To Move',
      'Lift Available',
      'Ceiling Height',
      'Floor',
      'Age of Property',
      'Security Personal',
      'Surveillance',
      'Alarm System',
      'car',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Villa: [
      'Age of Property',
      'Gated community security',
      'Surveillance',
      'Alarm System',
      'Car Parking',
      'Direction of Facing',
      'Approved By',
      'ZIP',
      'Amount',
      // 'Amount Unit',
      'Property Area',
      'Property Unit',
      'Property Discription',
    ],
    Warehouse: [
      'Age of Property',
      'Security Personal',
      'Surveillance',
      'Alarm System',
      'Property Discription',
    ],
    // Add more property types and their respective fields here
  };

  const getFieldsToShow = () => {
    const selectedPropertyId = formData.PropertyType;
    const selectedProperty = masterData?.PropertyType?.find(
      item => item.ID === selectedPropertyId,
    );
    const propertyTypeName = selectedProperty?.MasterDetailName || '';

    console.log('Selected Property Name:', propertyTypeName);
    const fields = propertyTypeFields[propertyTypeName as PropertyType] ?? [];
    console.log('Fields to show:', fields);

    return fields;
  };

  const fieldsToShow = getFieldsToShow();

  return (
    <ImageBackground
      source={require('../../../assets/Images/bgimg1.png')}
      style={styles.background}>
      <View style={styles.mainheading}>
        <Text style={styles.mainheadingtext}>Property Details</Text>
      </View>
      <FlatList
        data={[1]}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <SegmentedButtons
                value={values}
                onValueChange={setValue}
                buttons={[
                  {
                    value: 'Basic Info',
                    label: 'Basic Info',
                    onPress: () => navigation.navigate('FormScreen1'),
                    disabled: false, // Always enabled
                  },
                  {
                    value: 'Property info',
                    label: 'Property Info',
                    onPress: () => navigation.navigate('FormScreen2'),
                    disabled: false, // Disable if required fields are not filled
                  },
                  {
                    value: 'Images',
                    label: 'Image Upload',
                    onPress: () => navigation.navigate('FormScreen3'),
                    disabled: !isContinueClicked, // Disable if required fields are not filled
                  },
                ]}
              />
              {renderOptionSection(
                'Property Type',
                'PropertyType',
                masterData?.PropertyType || [],
                true,
              )}
              {renderSimpleOptionButtons(
                'Property Classification',
                'PropertyForType',
                ['Residential', 'Commercial'],
              )}
              {fieldsToShow.includes('Any Construction') &&
                renderSimpleOptionButtons(
                  'Any Construction',
                  'ConstructionDone',
                  ['Yes', 'No'],
                )}
              {fieldsToShow.includes('Boundary') &&
                renderSimpleOptionButtons('Boundary', 'BoundaryWall', [
                  'Yes',
                  'No',
                ])}
              {fieldsToShow.includes('No. of Open Side') &&
                renderSimpleOptionButtons('No. of Open Side', 'OpenSide', [
                  'Yes',
                  'No',
                ])}
              {fieldsToShow.includes('Age of Property') &&
                renderSimpleOptionButtons('Age of Property', 'PropertyAge', [
                  '0-5 Yrs',
                  '5-10 Yrs',
                  '10-15 Yrs',
                  '15-20 Yrs',
                  '20+ Yrs',
                ])}
              {fieldsToShow.includes('Security Personal') &&
                renderSimpleOptionButtons(
                  'Security Personal',
                  'GatedSecurity',
                  ['Yes', 'No'],
                )}
              {fieldsToShow.includes('Gated community security') &&
                renderSimpleOptionButtons(
                  'Gated community security',
                  'GatedSecurity',
                  ['Yes', 'No'],
                )}
              {fieldsToShow.includes('Surveillance') &&
                renderSimpleOptionButtons(
                  'Surveillance',
                  'SurveillanceCameras',
                  ['Yes', 'No'],
                )}
              {fieldsToShow.includes('Alarm System') &&
                renderSimpleOptionButtons('Alarm System', 'AlarmSystem', [
                  'Yes',
                  'No',
                ])}
              {fieldsToShow.includes('Ready To Move') &&
                renderSimpleOptionButtons('Ready To Move', 'readyToMove', [
                  'Yes',
                  'No',
                ])}
              {fieldsToShow.includes('Lift Available') &&
                renderSimpleOptionButtons('Lift Available', 'Lifts', [
                  'Yes',
                  'No',
                ])}
              {fieldsToShow.includes('Ceiling Height') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ceiling Height</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={formData.CeilingHeight || ''}
                    onChangeText={value =>
                      setFormData({...formData, CeilingHeight: value})
                    }
                    placeholder="CeilingHeight"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {fieldsToShow.includes('Configuration') &&
                renderOptionSection(
                  'Configuration',
                  'BhkType',
                  masterData?.BhkType || [],
                )}
              {fieldsToShow.includes('Pantry') &&
                renderSimpleOptionButtons('Pantry', 'Pantry', ['Yes', 'No'])}
              {fieldsToShow.includes('Floor') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Floor</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={formData.floor || ''}
                    onChangeText={value =>
                      setFormData({...formData, floor: value})
                    }
                    placeholder="Enter floor number"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              )}
              {fieldsToShow.includes('Furnished Type') &&
                renderOptionSection(
                  'Furnished Type',
                  'Furnishing',
                  masterData?.FurnishType || [],
                )}
              {fieldsToShow.includes('Car Parking') &&
                renderSimpleOptionButtons('Car Parking', 'Parking', [
                  'Yes - Shaded',
                  'Yes - Unshaded',
                  'No',
                ])}
              {fieldsToShow.includes('Direction of Facing') &&
                renderOptionSection(
                  'Direction of Facing',
                  'Facing',
                  masterData?.Facing || [],
                )}
              {fieldsToShow.includes('Approved By') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Approved By</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={formData.ApprovedBy || ''}
                    onChangeText={value =>
                      setFormData({...formData, ApprovedBy: value})
                    }
                    placeholder="Enter approval authority"
                  />
                </View>
              )}
              {fieldsToShow.includes('ZIP') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ZIP</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={formData.ZipCode || ''}
                    onChangeText={value =>
                      setFormData({...formData, ZipCode: value})
                    }
                    placeholder="Enter ZIP code"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              )}

{fieldsToShow.includes('Amount') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Amount<Text style={styles.asterisk}> *</Text>
                  </Text>
                  <MaterialTextInput
                    field="Price"
                    formInput={formData}
                    setFormInput={(field, value) => {
                      // Only allow numbers
                      if (typeof value === 'string' && /^\d*$/.test(value)) {
                        setFormData({...formData, [field]: value});
                      }
                    }}
                    mode="outlined"
                    placeholder="Enter Amount"
                    keyboardType="number-pad"
                    maxLength={9}
                    rightComponent={
                      <Text>{formatCurrency(formData.Price || '')}</Text>
                    }
                    style={styles.input}
                    outlineColor="#ddd"
                    activeOutlineColor={Colors.main}
                  />
                </View>
              )}
              {/* {fieldsToShow.includes('Amount Unit') &&
                renderOptionSection(
                  'Amount Unit',
                  'Rate',
                  masterData?.AmountUnit || [],
                  false,
                )} */}
              {fieldsToShow.includes('Property Area') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Property Area<Text style={styles.asterisk}> *</Text>
                  </Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={String(formData.Area || '')}
                    onChangeText={value =>
                      setFormData({...formData, Area: Number(value)})
                    }
                    placeholder="Property Area"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              )}
              {fieldsToShow.includes('Property Unit') &&
                renderOptionSection(
                  'Property Unit',
                  'BhkType',
                  masterData?.AreaUnit || [],
                  true,
                )}

              {fieldsToShow.includes('Property Discription') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Property Description<Text style={styles.asterisk}> *</Text>
                  </Text>
                  <TextInput
                    mode="outlined"
                    style={styles.propertyDescriptionInput} // Apply new style
                    value={String(formData.Discription || '')}
                    onChangeText={value =>
                      setFormData({...formData, Discription: value})
                    }
                    placeholder="Enter Property Description"
                    keyboardType="default"
                    multiline={true} // Make sure multiline is enabled
                  />
                </View>
                // <View style={styles.section}>
                //   <Text style={styles.sectionTitle}>
                //     Property Description<Text style={styles.asterisk}> *</Text>
                //   </Text>
                //   <TextInput
                //     mode="outlined"
                //     // eslint-disable-next-line react-native/no-inline-styles
                //     style={[styles.input, {height: 150}]}
                //     value={String(formData.Discription || '')}
                //     onChangeText={value =>
                //       setFormData({...formData, Discription: value})
                //     }
                //     placeholder=""
                //     keyboardType="default"
                //   />
                // </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.touchableOpacity,
                  !isFormValid() && styles.disabledButton, // Apply disabled style if form is not valid
                ]}
                onPress={
                  isFormValid()
                    ? () => handleNext()
                    : // ? () => navigation.navigate('FormScreen3', {formData})
                      () => {}
                } // Use an empty function instead of null
                disabled={!isFormValid()} // Disable the button if form is not valid
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => navigation.navigate('FormScreen3', {formData})}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity> */}
            </View>
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  propertyDescriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10, // Add padding for better user experience
    textAlignVertical: 'top', // Ensure text starts from the top in multi-line input
    height: 150, // Adjust height as needed
  },
  asterisk: {
    color: 'red',
  },
  disabledButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainheading: {
    padding: 10,
    left: 10,
    top: 15,
    fontSize: 20,
    paddingBottom: 50,
  },
  mainheadingtext: {
    fontSize: 29,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  section: {
    marginTop: 1,
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center', // Ensure text is centered vertically
  },
  selectedOption: {
    backgroundColor: Colors.main,
    borderColor: Colors.main,
  },
  optionText: {
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 11,
    // padding: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  moreButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center', // Ensure text is centered vertically
  },
  moreButtonText: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacity: {
    backgroundColor: Colors.main,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormScreen2;
