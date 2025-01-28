import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useMaster } from '../../context/MasterProvider';
import Header from '../../components/Header';

const PropertyListingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { masterData } = useMaster();
  const [sellerType, setSellerType] = useState('');
  const [city, setCity] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [furnishedType, setFurnishedType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isReadyToMove, setIsReadyToMove] = useState('');
  const [isLiftAvailable, setIsLiftAvailable] = useState('');
  const [isPantryAvailable, setIsPantryAvailable] = useState('');
  const [showMoreSellerType, setShowMoreSellerType] = useState(false);
  const [showMoreCity, setShowMoreCity] = useState(false);
  const [showMorePropertyFor, setShowMorePropertyFor] = useState(false);
  const [showMoreFurnishedType, setShowMoreFurnishedType] = useState(false);
  const [showMorePropertyType, setShowMorePropertyType] = useState(false);
  const [residentialCommercial, setResidentialCommercial] = useState('');
  const [carParking, setCarParking] = useState('');

  const toggleSelection = (selectedValue: string, currentValue: string, setValue: (value: string) => void) => {
    if (currentValue === selectedValue) {
      setValue('');
    } else {
      setValue(selectedValue);
    }
  };

  const renderSelectionGrid = (items: any[], selectedValue: string, onSelect: (value: string) => void, displayKey: string, showMore: boolean, setShowMore: (value: boolean) => void) => {
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
            onPress={() => toggleSelection(item.ID, selectedValue, onSelect)}
          >
            <Text
              style={[
                styles.gridItemText,
                selectedValue === item.ID && styles.selectedGridItemText,
              ]}
            >
              {item[displayKey]}
            </Text>
          </TouchableOpacity>
        ))}
        {items.length > 2 && (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={styles.gridItemText}>{showMore ? '-' : '+'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPropertyTypeSection = () => {
    const toggleResidentialCommercial = (newValue: string) => {
      if (residentialCommercial === newValue) {
        setResidentialCommercial(''); // Deselect if the same value is clicked again
      } else {
        setResidentialCommercial(newValue); // Select the new value
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
          setShowMorePropertyType
        )}
        <View style={styles.propertyTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              residentialCommercial === 'Residential' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleResidentialCommercial('Residential')}
          >
            <Text style={styles.toggleButtonText}>Residential</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              residentialCommercial === 'Commercial' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleResidentialCommercial('Commercial')}
          >
            <Text style={styles.toggleButtonText}>Commercial</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderToggleSection = (title: string, value: string, setValue: (value: string) => void) => {
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
            onPress={() => toggleValue('yes')}
          >
            <Text style={styles.toggleButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value === 'no' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleValue('no')}
          >
            <Text style={styles.toggleButtonText}>No</Text>
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
          <TouchableOpacity
            style={[
              styles.toggleButton,
              carParking === 'Yes Shaded' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleSelection('Yes Shaded', carParking, setCarParking)}
          >
            <Text style={styles.toggleButtonText}>Yes Shaded</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              carParking === 'Yes Unshaded' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleSelection('Yes Unshaded', carParking, setCarParking)}
          >
            <Text style={styles.toggleButtonText}>Yes Unshaded</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              carParking === 'No' && styles.selectedToggleButton,
            ]}
            onPress={() => toggleSelection('No', carParking, setCarParking)}
          >
            <Text style={styles.toggleButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderForm1 = () => (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Header title="Property Details" />
      </View>
      <Text style={styles.sectionTitle}>Seller Type</Text>
      {renderSelectionGrid(
        masterData?.SellerType || [],
        sellerType,
        setSellerType,
        'MasterDetailName',
        showMoreSellerType,
        setShowMoreSellerType
      )}

      <Text style={styles.sectionTitle}>City</Text>
      {renderSelectionGrid(
        masterData?.ProjectLocation || [],
        city,
        setCity,
        'MasterDetailName',
        showMoreCity,
        setShowMoreCity
      )}
      <Text style={styles.sectionTitle}>Property For</Text>
      {renderSelectionGrid(
        masterData?.PropertyFor || [],
        propertyFor,
        setPropertyFor,
        'MasterDetailName',
        showMorePropertyFor,
        setShowMorePropertyFor
      )}
      {renderPropertyTypeSection()}
      {renderToggleSection('Ready To Move', isReadyToMove, setIsReadyToMove)}
      {renderToggleSection('Lift Available', isLiftAvailable, setIsLiftAvailable)}
      {renderToggleSection('Pantry Available', isPantryAvailable, setIsPantryAvailable)}

      <Text style={styles.sectionTitle}>Furnished Type</Text>
      {renderSelectionGrid(
        masterData?.FurnishType || [],
        furnishedType,
        setFurnishedType,
        'MasterDetailName',
        showMoreFurnishedType,
        setShowMoreFurnishedType
      )}
      {renderCarParkingSection()}
      <Button
        mode="contained"
        style={styles.saveButton}
        onPress={() => setCurrentStep(2)}
      >
        Save and Next
      </Button>
    </View>
  );

  const renderForm2 = () => (
    <View style={styles.uploadContainer}>
      <Text style={styles.uploadText}>
        Upload your photo and video to showcase your listing in just a few simple steps!
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => {}}>
        <Text style={styles.uploadButtonText}>Upload from gallery</Text>
      </TouchableOpacity>
      <Button
        mode="contained"
        style={styles.listPropertyButton}
        onPress={() => setCurrentStep(2)}
      >
        List Your Property
      </Button>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {currentStep === 1 ? renderForm1() : renderForm2()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    right: 18,
    bottom: 15,
  },
  uploadContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#333',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    flex: 1,
    minWidth: '30%',
    margin: 3,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedGridItem: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  gridItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedGridItemText: {
    color: '#4caf50',
  },
  propertyTypeToggle: {
    flexDirection: 'row',
    marginTop: 10,
    left: 4,
    gap: 10,
    width: '98%',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedToggleButton: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  toggleButtonText: {
    fontSize: 14,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    marginBottom: 80,
  },
  listPropertyButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#4caf50',
  },
});

export default PropertyListingForm;
