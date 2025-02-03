// screens/FormScreen1.js
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {SegmentedButtons, Text} from 'react-native-paper';
import {useMaster} from '../../../context/MasterProvider';
import {Chip} from 'react-native-paper';
import LocationComponent from '../../../components/LocationComponent';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import {MasterDetailModel} from '../../../types';
import {usePropertyForm} from '../../../context/PropertyFormContext';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen1'>;

const FormScreen1: React.FC<Props> = ({navigation}) => {
  const [values, setValue] = useState('Basic Info');
  const {masterData} = useMaster();
  const {isEditMode} = usePropertyForm();
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [showAll, setShowAll] = useState<{[key: string]: boolean}>({
    SellerType: false,
    City: false,
    PropertyFor: false,
  });

  const {formData, updateFormField, isFormValid} = usePropertyForm();
  const initialChipsToShow = 2;

  const handleChipPress = (
    key: keyof typeof formData,
    value: string | number,
  ) => {
    updateFormField(key, formData[key] === value ? null : value);
  };

  const handleLocationChange = (location: string) => {
    updateFormField('Location', location);
  };

  const handleNext = () => {
    setIsContinueClicked(true);
    navigation.navigate('FormScreen2');
  };

  const renderChipSection = (
    title: string,
    key: keyof typeof formData,
    data: MasterDetailModel[],
    isRequired: boolean = false,
  ) => {
    const displayedChips = showAll[key]
      ? data
      : data.slice(0, initialChipsToShow);

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {title} {isRequired && <Text style={styles.asterisk}>*</Text>}
        </Text>
        <View style={styles.gridWrapper}>
          {displayedChips?.map((item, index) => (
            <Chip
              key={index}
              onPress={() => handleChipPress(key, item.ID)}
              style={[
                styles.chip,
                formData[key] === item.ID && styles.selectedChip,
              ]}
              textStyle={formData[key] === item.ID && styles.selectedChip}>
              {item.MasterDetailName}
            </Chip>
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

  return (
    <ImageBackground
      source={require('../../../assets/Images/bgimg1.png')}
      style={styles.background}>
      <View style={styles.mainheading}>
        <Text style={styles.mainheadingtext}>{isEditMode ? 'Edit Property Details' : 'Add Property Details'}</Text>
      </View>
      <FlatList
        data={[1]} // To force the FlatList to render, add a dummy item
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        //  keyboardDismissMode="on-drag"
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <SegmentedButtons
                value={values}
                onValueChange={setValue}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: '#f5f5f5', // Background color of the entire button group
                  borderRadius: 1, // Rounded corners
                  padding: 2, // Add spacing
                }}
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
                    disabled: !isContinueClicked, // Disable if basic info is not filled
                  },
                  {
                    value: 'Images',
                    label: 'Image Upload',
                    onPress: () => navigation.navigate('FormScreen3'),
                    disabled: true, // Disable until the second form is filled (you can add additional logic here)
                  },
                ]}
              />

              {renderChipSection(
                'Seller Type',
                'SellerType',
                masterData?.SellerType || [],
                true,
              )}
              {renderChipSection(
                'City',
                'City',
                masterData?.ProjectLocation || [],
                true,
              )}
              {renderChipSection(
                'Property For',
                'PropertyFor',
                masterData?.PropertyFor || [],
                true,
              )}

              <View pointerEvents="auto" style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}> Property Location</Text>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <LocationComponent
                    onLocationChange={handleLocationChange}
                    color="grey"
                    label="_"
                  />
                </ScrollView>
              </View>
              {/* <View pointerEvents="auto">
  <ScrollView keyboardShouldPersistTaps="handled">
    <LocationComponent
      onLocationChange={handleLocationChange}
      color="grey"
      label="Property Location"
    // Ensure input is enabled
    />
  </ScrollView>
</View> */}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.touchableOpacity,
                  !isFormValid(1) && styles.disabledButton, // Apply disabled style if form is not valid
                ]}
                onPress={isFormValid(1) ? handleNext : () => {}} // Only allow press if form is valid
                disabled={!isFormValid(1)} // Disable the button if form is not valid
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={handleNext}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity> */}
            </View>
          </>
        }
        // keyExtrac/tor={(item, index) => index.toString()} // Add key extractor to avoid warning
        // renderItem={() => null}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  asterisk: {
    color: 'red',
  },
  disabledButton: {
    color: 'white', // Set text color to white
    fontSize: 18, // Adjust font size
    fontWeight: 'bold', // Make the text bold
    opacity: 0.5, // Reduce opacity to indicate disabled state
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
  buttonContainer: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center', // Center the TouchableOpacity
    alignItems: 'center', // Center the text inside
  },
  touchableOpacity: {
    backgroundColor: Colors.main, // Set background color
    paddingVertical: 10, // Vertical padding to make the button taller
    borderRadius: 8, // Rounded corners
    justifyContent: 'center', // Vertically center the text
    alignItems: 'center', // Horizontally center the text
    width: 300,
  },
  buttonText: {
    color: 'white', // Set text color to white
    fontSize: 18, // Adjust font size
    fontWeight: 'bold', // Make the text bold
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Remove or reduce transparency
  },
  sectionContainer: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Remove or make transparent
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    margin: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  selectedChip: {
    backgroundColor: Colors.main,
    borderColor: Colors.main,
    color: 'white',
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
});

export default FormScreen1;
