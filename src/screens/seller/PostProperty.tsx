import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Text, Button, TextInput, HelperText} from 'react-native-paper';
import {useMaster} from '../../context/MasterProvider';
import Header from '../../components/Header';
import LocationComponent from '../../components/LocationComponent';
import Colors from '../../constants/Colors';

const PropertyListingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {masterData} = useMaster();
  const [sellerType, setSellerType] = useState('');
  const [city, setCity] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [furnishedType, setFurnishedType] = useState('');
  const [facing, setFacing] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isReadyToMove, setIsReadyToMove] = useState('');
  const [isLiftAvailable, setIsLiftAvailable] = useState('');
  const [amountUnit, setAmountUnit] = useState('');
  const [areaUnit, setAreaUnit] = useState('');
  const [isPantryAvailable, setIsPantryAvailable] = useState('');
  const [showMoreSellerType, setShowMoreSellerType] = useState(false);
  const [showMoreCity, setShowMoreCity] = useState(false);
  const [showMorePropertyFor, setShowMorePropertyFor] = useState(false);
  const [showMoreFurnishedType, setShowMoreFurnishedType] = useState(false);
  const [showMorePropertyType, setShowMorePropertyType] = useState(false);
  const [showMoreFacing, setShowMoreFacing] = useState(false);
  const [showAreaUnit, setshowAreaUnit] = useState(false);
  const [showAmountUnit, setshowAmountUnit] = useState(false);
  const [residentialCommercial, setResidentialCommercial] = useState('');
  const [carParking, setCarParking] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [amount, setAmount] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [description, setDescription] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  const handleLocationChange = () => {
    handleInputChange();
  };
  const handleInputChange = () => {};

  const toggleSelection = (
    selectedValue: string,
    currentValue: string,
    setValue: (value: string) => void,
  ) => {
    if (currentValue === selectedValue) {
      setValue('');
    } else {
      setValue(selectedValue);
    }
  };
  const validateZipCode = (code: string) => {
    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(code)) {
      setZipCodeError('Please enter a valid 6-digit zip code');
      return false;
    }
    setZipCodeError('');
    return true;
  };
  const renderSelectionGrid = (
    items: any[],
    selectedValue: string,
    onSelect: (value: string) => void,
    displayKey: string,
    showMore: boolean,
    setShowMore: (value: boolean) => void,
  ) => {
    const visibleItems = showMore ? items : items.slice(0, 2);
    return (
      <View style={styles.gridContainer}>
        {visibleItems.map((item: any) => (
          <TouchableOpacity
            key={item.ID}
            style={[
              styles.gridItem,
              selectedValue === item.ID && styles.selectedGridItem,
            ]}
            onPress={() => toggleSelection(item.ID, selectedValue, onSelect)}>
            <Text
              style={[
                styles.gridItemText,
                selectedValue === item.ID && styles.selectedGridItemText,
              ]}>
              {item[displayKey]}
            </Text>
          </TouchableOpacity>
        ))}
        {items.length > 2 && (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => setShowMore(!showMore)}>
            <Text style={styles.gridItemText}>{showMore ? '-' : '+'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPropertyTypeSection = () => {
    const toggleResidentialCommercial = (newValue: string) => {
      if (residentialCommercial === newValue) {
        setResidentialCommercial(''); //Deselect if the same value is clicked again
      } else {
        setResidentialCommercial(newValue);
      }
    };

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Property Type</Text>
        {renderSelectionGrid(
          masterData?.PropertyType || [],
          propertyType,
          setPropertyType,
          'MasterDetailName',
          showMorePropertyType,
          setShowMorePropertyType,
        )}
        <View style={styles.propertyTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              residentialCommercial === 'Residential' &&
                styles.selectedToggleButton,
            ]}
            onPress={() => toggleResidentialCommercial('Residential')}>
            <Text
              style={[
                styles.toggleButtonText,
                residentialCommercial === 'Residential' &&
                  styles.selectedToggleButtonText,
              ]}>
              Residential
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              residentialCommercial === 'Commercial' &&
                styles.selectedToggleButton,
            ]}
            onPress={() => toggleResidentialCommercial('Commercial')}>
            <Text
              style={[
                styles.toggleButtonText,
                residentialCommercial === 'Commercial' &&
                  styles.selectedToggleButtonText,
              ]}>
              Commercial
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderToggleSection = (
    title: string,
    value: string,
    setValue: (value: string) => void,
  ) => {
    const toggleValue = (newValue: string) => {
      if (value === newValue) {
        setValue(''); // Deselect if the same value is clicked again
      } else {
        setValue(newValue); // Select the new value
      }
    };

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.propertyTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value === 'yes' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleValue('yes')}>
            <Text
              style={[
                styles.toggleButtonText,
                value === 'yes' && styles.selectedToggleButtonText,
              ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value === 'no' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleValue('no')}>
            <Text
              style={[
                styles.toggleButtonText,
                value === 'no' && styles.selectedToggleButtonText,
              ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderCarParkingSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Car Parking</Text>
        <View style={styles.propertyTypeToggle}>
          {['Yes Shaded', 'Yes Unshaded', 'No'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.toggleButton,
                carParking === option && styles.selectedToggleButton,
              ]}
              onPress={() =>
                toggleSelection(option, carParking, setCarParking)
              }>
              <Text
                style={[
                  styles.toggleButtonText,
                  carParking === option && styles.selectedToggleButtonText,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  const renderForm1 = () => (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Header title="Property Details" />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Seller Type</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.SellerType || [],
            sellerType,
            setSellerType,
            'MasterDetailName',
            showMoreSellerType,
            setShowMoreSellerType,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>City</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.ProjectLocation || [],
            city,
            setCity,
            'MasterDetailName',
            showMoreCity,
            setShowMoreCity,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Property For</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.PropertyFor || [],
            propertyFor,
            setPropertyFor,
            'MasterDetailName',
            showMorePropertyFor,
            setShowMorePropertyFor,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>{renderPropertyTypeSection()}</View>

      <View style={styles.sectionContainer}>
        {renderToggleSection('Ready To Move', isReadyToMove, setIsReadyToMove)}
      </View>

      <View style={styles.sectionContainer}>
        {renderToggleSection(
          'Lift Available',
          isLiftAvailable,
          setIsLiftAvailable,
        )}
      </View>

      <View style={styles.sectionContainer}>
        {renderToggleSection(
          'Pantry Available',
          isPantryAvailable,
          setIsPantryAvailable,
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Furnished Type</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.FurnishType || [],
            furnishedType,
            setFurnishedType,
            'MasterDetailName',
            showMoreFurnishedType,
            setShowMoreFurnishedType,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>{renderCarParkingSection()}</View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Direction of Facing</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.Facing || [],
            facing,
            setFacing,
            'MasterDetailName',
            showMoreFacing,
            setShowMoreFacing,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <LocationComponent
          onLocationChange={handleLocationChange}
          color="grey"
          borderColor=""
          backgroundcolor="white"
          label="Property Address"
        />
      </View>

      <View style={styles.sectionContainer}>
        <TextInput
          mode="outlined"
          label="Zip Code"
          value={zipCode}
          onChangeText={text => {
            setZipCode(text);
            if (text.length === 6) {
              validateZipCode(text);
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          error={!!zipCodeError}
        />
        <HelperText type="error" visible={!!zipCodeError}>
          {zipCodeError}
        </HelperText>
      </View>

      <View style={styles.sectionContainer}>
        <TextInput
          mode="outlined"
          label="Amount (INR)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          style={styles.input}
          left={<TextInput.Affix text="₹" />}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Amount Unit</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.AmountUnit || [],
            amountUnit,
            setAmountUnit,
            'MasterDetailName',
            showAmountUnit,
            setshowAmountUnit,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <TextInput
          mode="outlined"
          label="Property Area"
          value={propertyArea}
          onChangeText={setPropertyArea}
          keyboardType="numeric"
          style={styles.input}
          // right={<TextInput.Affix text="sq ft" />}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Property Unit</Text>
        <View style={styles.gridWrapper}>
          {renderSelectionGrid(
            masterData?.AreaUnit || [],
            areaUnit,
            setAreaUnit,
            'MasterDetailName',
            showAreaUnit,
            setshowAreaUnit,
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <TextInput
          mode="outlined"
          label="Property Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.descriptionInput]}
        />
      </View>

      <Button
        mode="contained"
        style={styles.saveButton}
        onPress={() => setCurrentStep(2)}>
        Save and Next
      </Button>
    </View>
  );

  const renderForm2 = () => (
    <View style={styles.uploadContainer}>
      <Text style={styles.uploadText}>
        Upload your photo and video to showcase your listing in just a few
        simple steps!
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => {}}>
        <Text style={styles.uploadButtonText}>Upload from gallery</Text>
      </TouchableOpacity>
      <Button
        mode="contained"
        style={styles.listPropertyButton}
        onPress={() => setCurrentStep(2)}>
        List Your Property
      </Button>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <ScrollView style={styles.container}>
        {currentStep === 1 ? renderForm1() : renderForm2()}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  gridWrapper: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  selectedToggleButtonText: {
    color: 'white', // Change this to the desired selected text color
  },
  header: {
    marginBottom: 20,
    right: 10,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputFieldsContainer: {
    marginTop: 24,
    marginBottom: 16,
    gap: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    height: 56,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: '30%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
  },
  selectedGridItem: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderColor: Colors.MT_PRIMARY_1,
    borderWidth: 1.5,
  },
  gridItemText: {
    fontSize: 13,
    color: '#424242',
    textAlign: 'center',
  },
  selectedGridItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  propertyTypeToggle: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    height: 48,
  },
  selectedToggleButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderColor: Colors.MT_PRIMARY_1,
    color: 'white',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#424242',
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 90,
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: -8,
    marginBottom: 8,
  },
  uploadContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginVertical: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '600',
  },
  listPropertyButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    height: 48,
  },
});
export default PropertyListingForm;
