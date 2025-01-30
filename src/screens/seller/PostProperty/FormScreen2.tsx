import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {PropertyFormData} from '../../../types/propertyform';
import {SegmentedButtons, Text, TextInput} from 'react-native-paper';
import {useMaster} from '../../../context/MasterProvider';
import Colors from '../../../constants/Colors';
import {FlatList} from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen2'>;

const FormScreen2: React.FC<Props> = ({navigation, route}) => {
  const {masterData} = useMaster();
  const [values, setValue] = useState('Property info');
  const [formData, setFormData] = useState(route.params.formData);
  const [showAll, setShowAll] = useState<{[key: string]: boolean}>({
    PropertyType: false,
    Facing: false,
    FurnishType: false,
  });
  const initialChipsToShow = 2;

  const handleOptionPress = (key: keyof PropertyFormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: prevState[key] === value ? '' : value,
    }));
  };

  const renderOptionSection = (
    title: string,
    key: keyof PropertyFormData,
    data: any[],
  ) => {
    const displayedOptions = showAll[key]
      ? data
      : data.slice(0, initialChipsToShow);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.optionsGrid}>
          {displayedOptions?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                formData[key] === item.MasterDetailName &&
                  styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(key, item.MasterDetailName)}>
              <Text
                style={[
                  styles.optionText,
                  formData[key] === item.MasterDetailName &&
                    styles.selectedOptionText,
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
    field: keyof PropertyFormData,
    options: string[],
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
                  },
                  {
                    value: 'Property info',
                    label: 'Property Info',
                    onPress: () =>
                      navigation.navigate('FormScreen2', {formData}),
                  },
                  {
                    value: 'Images',
                    label: 'Image Upload',
                    onPress: () =>
                      navigation.navigate('FormScreen3', {formData}),
                  },
                ]}
              />
              {renderOptionSection(
                'Property Type',
                'PropertyType',
                masterData?.PropertyType || [],
              )}
              {renderSimpleOptionButtons(
                'Property Classification',
                'propertyClassification',
                ['Residential', 'Commercial'],
              )}
              {/* Plot Design */}
              <View>
                {renderSimpleOptionButtons(
                  'Any Construction',
                  'ConstructionDone',
                  ['Yes', 'No'],
                )}
                {renderSimpleOptionButtons('Boundary', 'BoundaryWall', [
                  'Yes',
                  'No',
                ])}
                {renderSimpleOptionButtons('No. of Open Side', 'OpenSide', [
                  'Yes',
                  'No',
                ])}
              </View>
              {/* Farm House design */}
              <View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Age of Property</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={formData.PropertyAge || ''}
                    onChangeText={value =>
                      setFormData({...formData, PropertyAge: value})
                    }
                    placeholder="Property Age"
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              {/* Retail Shop */}
              {renderSimpleOptionButtons('Security Personal', 'GatedSecurity', [
                  'Yes',
                  'No',
                ])}
              {renderSimpleOptionButtons(
                'Gated community security',
                'GatedSecurity',
                ['Yes', 'No'],
              )}
              {renderSimpleOptionButtons(
                'Surveillance Cameras',
                'SurveillanceCameras',
                ['Yes', 'No'],
              )}
              {renderSimpleOptionButtons('Alarm System', 'AlarmSystem', [
                'Yes',
                'No',
              ])}
              {renderSimpleOptionButtons('Ready To Move', 'readyToMove', [
                'Yes',
                'No',
              ])}

              {renderSimpleOptionButtons('Lift Available', 'Lifts', [
                'Yes',
                'No',
              ])}
              {/* FOCP DESIGN */}
              <View>
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
              </View>
              {/* Flat  */}
              {renderOptionSection(
                'Configuration',
                'BhkType',
                masterData?.BhkType || [],
              )}
              {/* Flat end */}

              {renderSimpleOptionButtons('Pantry', 'Pantry', ['Yes', 'No'])}

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
                />
              </View>

              {renderOptionSection(
                'Furnished Type',
                'Furnishing',
                masterData?.FurnishType || [],
              )}

              {renderSimpleOptionButtons('Car Parking', 'CarParking', [
                'Yes - Shaded',
                'Yes - Unshaded',
                'No',
              ])}

              {renderOptionSection(
                'Direction of Facing',
                'Facing',
                masterData?.Facing || [],
              )}

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
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amount</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={formData.Price || ''}
                  onChangeText={value =>
                    setFormData({...formData, Price: value})
                  }
                  placeholder="Enter Amount"
                  keyboardType="number-pad"
                />
              </View>
              {renderOptionSection(
                'Amount Unit',
                'Rate',
                masterData?.AmountUnit || [],
              )}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property Area</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={formData.Area || ''}
                  onChangeText={value =>
                    setFormData({...formData, Area: value})
                  }
                  placeholder="Property Area"
                  keyboardType="number-pad"
                />
              </View>
              {renderOptionSection(
                'Property Unit',
                'Area',
                masterData?.AreaUnit || [],
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => navigation.navigate('FormScreen3', {formData})}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
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
    borderRadius: 8,
    // padding: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  moreButton: {
    margin: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  moreButtonText: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
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
