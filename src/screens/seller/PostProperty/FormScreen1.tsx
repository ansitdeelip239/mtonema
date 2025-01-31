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
import {PropertyFormData} from '../../../types/propertyform';
import {SegmentedButtons, Text} from 'react-native-paper';
import {useMaster} from '../../../context/MasterProvider';
import {Chip} from 'react-native-paper';
import LocationComponent from '../../../components/LocationComponent';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import {MasterDetailModel} from '../../../types';
import {useAuth} from '../../../hooks/useAuth';
type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen1'>;
const FormScreen1: React.FC<Props> = ({navigation}) => {
  const [values, setValue] = useState('Basic Info');
  const {masterData} = useMaster();
  const {user} = useAuth();
  const [showAll, setShowAll] = useState<{[key: string]: boolean}>({
    SellerType: false,
    City: false,
    PropertyFor: false,
  });
  const initialChipsToShow = 2;
  const [formData, setFormData] = useState<PropertyFormData>({
    AlarmSystem: null,
    ApprovedBy: '',
    Area: null,
    BhkType: null,
    BoundaryWall: null,
    CeilingHeight: null,
    City: null,
    ConstructionDone: null,
    Country: null,
    CreatedBy: null,
    Discription: null,
    Facing: null,
    Furnishing: null,
    GatedSecurity: null,
    ImageURL: [],
    ImageURLType: [],
    IsFeatured: false,
    Lifts: null,
    Location: null,
    OpenSide: null,
    Pantry: null,
    Parking: null,
    Price: null,
    PropertyAge: null,
    PropertyFor: null,
    PropertyForType: 'Residential',
    PropertyType: null,
    Rate: null,
    SellerEmail: user?.Email || '',
    SellerName: user?.Name || '',
    SellerPhone: user?.Phone || '',
    SellerType: null,
    ShortDiscription: null,
    Size: null,
    State: null,
    Status: null,
    SurveillanceCameras: null,
    Tag: null,
    Tags: [],
    UserId: user?.ID.toString() || '',
    VideoURL: null,
    ZipCode: null,
    CarParking: null,
    floor: null,
    locality: null,
    otherCity: null,
    readyToMove: null,
    statusText: null,
    video: null,
    propertyClassification: null,
  });

  const handleChipPress = (
    key: keyof PropertyFormData,
    value: string | number,
  ) => {
    setFormData(prevState => {
      // Check if the chip is already selected
      const currentValue = prevState[key];
      if (currentValue === value) {
        // Deselect if it's already selected
        return {...prevState, [key]: null};
      } else {
        // Select the chip
        return {...prevState, [key]: value};
      }
    });
  };
  //   const handleLocationChange = () => {
  //     handleInputChange();
  //   };
  //   const handleInputChange = () => {};
  const handleNext = () => navigation.navigate('FormScreen2', {formData});

  const isFormValid = () => {
    return (
      formData.SellerType !== null &&
      formData.City !== null &&
      formData.PropertyFor !== null
    );
  };
  const handleLocationChange = (location: string) => {
    console.log('Location', location);

    setFormData(prev => ({
      ...prev,
      Location: location,
    }));
  };

  const renderChipSection = (
    title: string,
    key: keyof PropertyFormData,
    data: MasterDetailModel[],
    isRequired: boolean = false,
  ) => {
    const displayedChips = showAll[key]
      ? data
      : data.slice(0, initialChipsToShow);
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {title} {isRequired && <Text style={styles.asterisk}>*</Text>}{' '}
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
        <Text style={styles.mainheadingtext}>Property Details</Text>
      </View>
      <FlatList
        data={[1]} // To force the FlatList to render, add a dummy item
        contentContainerStyle={styles.scrollContainer}
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
                    onPress: () =>
                      navigation.navigate('FormScreen2', {formData}),
                    disabled: !isFormValid(), // Disable if basic info is not filled
                  },
                  {
                    value: 'Images',
                    label: 'Image Upload',
                    onPress: () =>
                      navigation.navigate('FormScreen3', {formData}),
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

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}> Property Location</Text>
                <LocationComponent
                  onLocationChange={handleLocationChange}
                  color="grey"
                  label="Property Location"
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.touchableOpacity,
                  !isFormValid() && styles.disabledButton, // Apply disabled style if form is not valid
                ]}
                onPress={isFormValid() ? handleNext : () => {}} // Only allow press if form is valid
                disabled={!isFormValid()} // Disable the button if form is not valid
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
        keyExtractor={(item, index) => index.toString()} // Add key extractor to avoid warning
        renderItem={() => null}
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
