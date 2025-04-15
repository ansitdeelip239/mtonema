import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
// import PropertyDetailsStep from './steps/PropertyDetailsStep';
// import MediaDetailsStep from './steps/MediaDetailsStep';
import {PartnerDrawerParamList} from '../../../types/navigation';
import FormStepper from './components/FormStepper';
import BasicDetailsStep from './BasicDetailsStep';
import {
  PartnerPropertyApiSubmissionType,
  PartnerPropertyFormType,
} from '../../../schema/PartnerPropertyFormSchema';
import PropertyDetailsStep from './PropertyDetailsStep';
import MediaAndSubmitStep from './MediaAndSubmitStep';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import Toast from 'react-native-toast-message';

const steps = ['Basic Info', 'Property Details', 'Media & Submit'];

const AddPartnerPropertyScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const {user} = useAuth();

  const {formInput, handleInputChange, handleSelect, onSubmit, loading, resetForm} =
    useForm<PartnerPropertyFormType>({
      initialState: {
        propertyType: null,
        city: null,
        propertyFor: null,
        sellerType: null,
        location: null,
        zipCode: null,
        propertyName: null,
        price: null,
        imageURL: null,
        alarmSystem: null,
        videoURL: null,
        shortDescription: null,
        longDescription: null,
        readyToMove: null,
        bhkType: null,
        propertyForType: null,
        area: null,
        furnishing: null,
        boundaryWall: null,
        isFeatured: null,
        floor: null,
        lmUnit: null,
        // rate: null,
        openSide: null,
        parking: null,
        facing: null,
        constructionDone: null,
        ceilingHeight: null,
        gatedSecurity: null,
        lifts: null,
        propertyAge: null,
        surveillanceCameras: null,
        pantry: null,
        tags: null,
      },
      onSubmit: async data => {
        console.log('Submitting property data:', data);
        try {
          const payload: PartnerPropertyApiSubmissionType = {
            ...data,
            userId: user?.id as number,
            tags: "['#test']",
          };
          console.log('Payload for API:', payload);

          const response = await PartnerService.postPartnerProperty(payload);

          if (response.success) {
            Toast.show({
              type: 'success',
              text1: 'Property added successfully',
            });
            resetForm();
          }
        } catch (error) {
          console.error('Error submitting property data:', error);
          Toast.show({
            type: 'error',
            text1: 'Failed to add property',
            text2: 'Please try again later.',
          });
        }
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
            handleSelect={handleSelect}
            onNext={goToNextStep}
            // No back button in first step
          />
        );
      case 1:
        return (
          <PropertyDetailsStep
            formInput={formInput}
            handleInputChange={handleInputChange}
            handleSelect={handleSelect}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            showBackButton={true}
          />
        );

      case 2:
        return (
          <MediaAndSubmitStep
            formInput={formInput}
            handleInputChange={handleInputChange}
            onSubmit={onSubmit}
            onBack={goToPreviousStep}
            showBackButton={true}
            isSubmitting={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Add Property" />

      {/* Fixed FormStepper */}
      <View style={styles.stepperContainer}>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          animatedValue={animatedValue}
        />
      </View>

      {/* Scrollable content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.stepContent}>{renderStep()}</View>

          {/* Bottom padding to avoid content being hidden by tab bar */}
          <View style={styles.bottomPadding} />
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
  stepperContainer: {
    backgroundColor: '#fff',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContent: {
    padding: 20,
  },
  bottomPadding: {
    height: 80, // Padding to avoid tab bar overlap
  },
});

export default AddPartnerPropertyScreen;
