import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
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
import {initialFormState} from '../../../utils/partner-property-form-initial-state';
import {usePartner} from '../../../context/PartnerProvider';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

const {width} = Dimensions.get('window');
const steps = ['Basic Info', 'Property Details', 'Media & Submit'];

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'AddProperty'>;

const AddPartnerPropertyScreen: React.FC<Props> = ({route, navigation}) => {
  const editMode = route.params?.editMode;
  const propertyData = route.params?.propertyData;

  const [currentStep, setCurrentStep] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const {user} = useAuth();
  const {setPartnerPropertyUpdated} = usePartner();

  // Create refs for each ScrollView
  const scrollViewRefs = useRef<(ScrollView | null)[]>([null, null, null]);

  const {
    formInput,
    handleInputChange,
    handleSelect,
    onSubmit,
    loading,
    resetForm,
    setFormInput, // Make sure your useForm hook returns this
  } = useForm<PartnerPropertyFormType>({
    // Use propertyData in edit mode, otherwise use initialFormState
    initialState: editMode && propertyData ? propertyData : initialFormState,
    onSubmit: async data => {
      try {
        const payload: PartnerPropertyApiSubmissionType = {
          ...data,
          userId: user?.id as number,
        };

        let response;

        // Different API call based on mode
        if (editMode && propertyData?.id) {
          response = await PartnerService.updatePartnerProperty(
            propertyData.id,
            payload,
          );
        } else {
          response = await PartnerService.postPartnerProperty(payload);
        }

        // Update your onSubmit handler
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? 'Property updated successfully'
              : 'Property added successfully',
          });

          // Set the flag to refresh listings screen
          setPartnerPropertyUpdated(prev => !prev);

          // Navigate back to listings screen
          navigation.navigate('Property', {screen: 'ListingsScreen'});

          // Use the complete reset function
          completeReset();
        }
      } catch (error) {
        console.error('Error submitting property data:', error);
        Toast.show({
          type: 'error',
          text1: editMode
            ? 'Failed to update property'
            : 'Failed to add property',
          text2: 'Please try again later.',
        });
      }
    },
  });

  // Add this useEffect to handle initial data processing for edit mode
  useEffect(() => {
    if (editMode && propertyData) {
      // Reset to first step when entering edit mode
      setCurrentStep(0);

      // Reset animations as well
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0, // immediate
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0, // immediate
        useNativeDriver: true,
      }).start();

      // Handle special fields like images that might need parsing
      if (propertyData.imageURL && typeof propertyData.imageURL === 'string') {
        try {
          // Parse image URLs if they're stored as JSON strings
          const imageData = JSON.parse(propertyData.imageURL);
          setFormInput({
            ...propertyData,
            imageURL: JSON.stringify(imageData), // Ensure it's in the right format
          });
        } catch (e) {
          console.error('Error parsing image data:', e);
          setFormInput(propertyData);
        }
      } else {
        setFormInput(propertyData);
      }
    }
  }, [editMode, propertyData, setFormInput, animatedValue, slideAnimation]);

  // Add this useEffect for cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      resetForm(); // This uses the internal resetForm
    };
  }, [resetForm]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      // Animate stepper
      Animated.timing(animatedValue, {
        toValue: currentStep + 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Animate slide
      Animated.timing(slideAnimation, {
        toValue: (currentStep + 1) * -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After animation completes, update current step and scroll to top
        setCurrentStep(currentStep + 1);

        // Scroll the next step's ScrollView to the top
        const nextScrollView = scrollViewRefs.current[currentStep + 1];
        if (nextScrollView) {
          nextScrollView.scrollTo({x: 0, y: 0, animated: true});
        }
      });
    } else {
      onSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // Animate stepper
      Animated.timing(animatedValue, {
        toValue: currentStep - 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Animate slide
      Animated.timing(slideAnimation, {
        toValue: (currentStep - 1) * -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After animation completes, update current step and scroll to top
        setCurrentStep(currentStep - 1);

        // Scroll the previous step's ScrollView to the top
        const prevScrollView = scrollViewRefs.current[currentStep - 1];
        if (prevScrollView) {
          prevScrollView.scrollTo({x: 0, y: 0, animated: true});
        }
      });
    }
  };

  // Add this function to your component
  const completeReset = () => {
    // Reset form data to initial empty state
    setFormInput(initialFormState);

    // Reset current step
    setCurrentStep(0);

    // Reset animations
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();

    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList>
        title={editMode ? 'Edit Property' : 'Add Property'}
      />

      {/* Fixed FormStepper */}
      <View style={styles.stepperContainer}>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          animatedValue={animatedValue}
        />
      </View>

      {/* Main container for sliding animation */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <Animated.View
          style={[
            styles.slidingContainer,
            {transform: [{translateX: slideAnimation}]},
          ]}>
          {/* First step with its own ScrollView */}
          <View style={styles.stepContainer}>
            <ScrollView
              ref={ref => (scrollViewRefs.current[0] = ref)}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.stepWrapper}>
                <BasicDetailsStep
                  formInput={formInput}
                  handleInputChange={handleInputChange}
                  handleSelect={handleSelect}
                  onNext={goToNextStep}
                />
              </View>
            </ScrollView>
          </View>

          {/* Second step with its own ScrollView */}
          <View style={styles.stepContainer}>
            <ScrollView
              ref={ref => (scrollViewRefs.current[1] = ref)}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.stepWrapper}>
                <PropertyDetailsStep
                  formInput={formInput}
                  handleInputChange={handleInputChange}
                  handleSelect={handleSelect}
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                  showBackButton={true}
                />
              </View>
            </ScrollView>
          </View>

          {/* Third step with its own ScrollView */}
          <View style={styles.stepContainer}>
            <ScrollView
              ref={ref => (scrollViewRefs.current[2] = ref)}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.stepWrapper}>
                <MediaAndSubmitStep
                  formInput={formInput}
                  handleInputChange={handleInputChange}
                  onSubmit={onSubmit}
                  onBack={goToPreviousStep}
                  showBackButton={true}
                  isSubmitting={loading}
                  submitButtonText={editMode ? 'Update Property' : 'Submit'} // Add this prop
                />
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
      {/* Bottom padding to avoid content being hidden by tab bar */}
      <View style={styles.bottomPadding} />
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
    overflow: 'hidden', // Important to clip content during animation
  },
  slidingContainer: {
    flexDirection: 'row',
    width: width * 3, // 3 steps
    flex: 1,
  },
  stepContainer: {
    width: width,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  stepWrapper: {
    padding: 20,
  },
  bottomPadding: {
    height: 80, // Padding to avoid tab bar overlap
  },
});

export default AddPartnerPropertyScreen;
