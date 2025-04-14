import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
// import PropertyDetailsStep from './steps/PropertyDetailsStep';
// import MediaDetailsStep from './steps/MediaDetailsStep';
import Colors from '../../../constants/Colors';
import {PartnerDrawerParamList} from '../../../types/navigation';
import FormStepper from './components/FormStepper';
import BasicDetailsStep from './BasicDetailsStep';
import { PropertyFormData } from './types';

const steps = ['Basic Info', 'Property Details', 'Media & Submit'];

const AddPartnerPropertyScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const {formInput, handleInputChange, onSubmit} =
    useForm<PropertyFormData>({
      initialState: {
        propertyTitle: '',
        propertyType: '',
        propertyLocation: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        price: '',
        description: '',
        images: [],
        amenities: [],
      },
      onSubmit: async data => {
        // Submit property data to your API
        console.log('Submitting property data:', data);
        // TODO: Add your API call here
      },
    });

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      Animated.timing(animatedValue, {
        toValue: currentStep + 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setCurrentStep(currentStep + 1);
      });
    } else {
      onSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      Animated.timing(animatedValue, {
        toValue: currentStep - 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetailsStep
            formInput={formInput}
            handleInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <BasicDetailsStep
            formInput={formInput}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <BasicDetailsStep
            formInput={formInput}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Add Property" backButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormStepper
            steps={steps}
            currentStep={currentStep}
            animatedValue={animatedValue}
          />

          <View style={styles.stepContent}>{renderStep()}</View>

          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={goToPreviousStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={goToNextStep}>
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    // flexGrow: 1,
    // paddingBottom: 30,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
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
});

export default AddPartnerPropertyScreen;
