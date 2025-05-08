import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {PartnerPropertyApiSubmissionType} from '../../../../schema/PartnerPropertyFormSchema';
import {useAuth} from '../../../../hooks/useAuth';
import {usePartner} from '../../../../context/PartnerProvider';
import useForm from '../../../../hooks/useForm';
import {initialFormState} from '../../../../utils/partner-property-form-initial-state';
import PartnerService from '../../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import Header from '../../../../components/Header';
import {PartnerDrawerParamList} from '../../../../types/navigation';
import FormStepper from './components/FormStepper';
import {useTheme} from '../../../../context/ThemeProvider';

// Import modular components
import FormStepContainer from './components/FormStepContainer';
import ClearFormButton from './components/ClearFormButton';
import {useFormNavigation} from './hooks/useFormNavigation';
import {useFormValidation} from './hooks/useFormValidation';

// Import step components
import BasicDetailsStep from './steps/BasicDetailsStep';
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import MediaAndSubmitStep from './steps/MediaAndSubmitStep';
import {usePropertyDataMapping} from './hooks/usePropertyDataMapping';

const {width} = Dimensions.get('window');
const steps = ['Basic Info', 'Property Details', 'Media & Submit'];

type PartnerPropertyFormProps = {
  editMode?: boolean;
  propertyData?: any;
  headerTitle: string;
  submitButtonText: string;
  navigation: any;
};

const PartnerPropertyForm: React.FC<PartnerPropertyFormProps> = ({
  editMode = false,
  propertyData,
  headerTitle,
  submitButtonText,
  navigation,
}) => {
  const {user} = useAuth();
  const {setPartnerPropertyUpdated} = usePartner();
  const {theme} = useTheme();

  // Use the property data mapping hook
  const propertyDataMapping = usePropertyDataMapping(propertyData);

  const {
    formInput,
    handleInputChange,
    handleSelect,
    onSubmit,
    loading,
    resetForm,
    setFormInput,
  } = useForm({
    initialState:
      editMode && propertyData ? propertyDataMapping : initialFormState,
    onSubmit: async data => {
      try {
        const payload: PartnerPropertyApiSubmissionType = {
          ...data,
          userId: user?.id as number,
          area: data.area ?? null,
          floor: data.floor ?? null,
        };

        let response;

        if (editMode && propertyData?.id) {
          response = await PartnerService.updatePartnerProperty(
            propertyData.id,
            payload,
          );
        } else {
          response = await PartnerService.postPartnerProperty(payload);
        }

        if (response.success) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? 'Property updated successfully'
              : 'Property added successfully',
          });

          setPartnerPropertyUpdated(prev => !prev);
          completeReset();

          navigation.reset({
            index: 0,
            routes: [{name: 'Property', params: {screen: 'ListingsScreen'}}],
          });
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

  // Use form validation hook
  const {validateStep} = useFormValidation(formInput);

  // Use form navigation hook
  const {
    currentStep,
    animatedValue,
    slideAnimation,
    scrollViewRefs,
    handleStepPress,
    goToNextStep,
    goToPreviousStep,
    resetNavigation,
  } = useFormNavigation({
    steps,
    validateStep,
  });

  // Handle edit mode initialization
  useEffect(() => {
    if (editMode && propertyData) {
      resetNavigation();

      if (propertyData.imageURL && typeof propertyData.imageURL === 'string') {
        try {
          const imageData = JSON.parse(propertyData.imageURL);
          setFormInput({
            ...propertyDataMapping,
            imageURL: JSON.stringify(imageData),
          });
        } catch (e) {
          console.error('Error parsing image data:', e);
          setFormInput(propertyDataMapping);
        }
      } else {
        setFormInput(propertyDataMapping);
      }
    }
  }, [
    editMode,
    propertyDataMapping,
    setFormInput,
    resetNavigation,
    propertyData,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // Complete form reset
  const completeReset = () => {
    setFormInput(initialFormState);
    resetNavigation();
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList>
        title={headerTitle}
        backButton={editMode}
        onBackPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Property', params: {screen: 'ListingsScreen'}}],
          });
        }}>
        <ClearFormButton
          onPress={completeReset}
          backgroundColor={theme.secondaryColor}
        />
      </Header>

      <View style={styles.stepperContainer}>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          animatedValue={animatedValue}
          onStepPress={handleStepPress}
          canMoveToNextStep={validateStep(currentStep)}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <Animated.View
          style={[
            styles.slidingContainer,
            {transform: [{translateX: slideAnimation}]},
          ]}>
          <FormStepContainer
            scrollViewRef={el => {
              scrollViewRefs.current[0] = el;
            }}>
            <BasicDetailsStep
              formInput={formInput}
              handleInputChange={handleInputChange}
              handleSelect={handleSelect}
              onNext={goToNextStep}
            />
          </FormStepContainer>

          <FormStepContainer
            scrollViewRef={el => {
              scrollViewRefs.current[1] = el;
            }}>
            <PropertyDetailsStep
              formInput={formInput}
              handleInputChange={handleInputChange}
              handleSelect={handleSelect}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              showBackButton={true}
            />
          </FormStepContainer>

          <FormStepContainer
            scrollViewRef={el => {
              scrollViewRefs.current[2] = el;
            }}>
            <MediaAndSubmitStep
              formInput={formInput}
              handleInputChange={handleInputChange}
              onSubmit={onSubmit}
              onBack={goToPreviousStep}
              showBackButton={true}
              isSubmitting={loading}
              submitButtonText={submitButtonText}
            />
          </FormStepContainer>
        </Animated.View>
      </KeyboardAvoidingView>
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
    overflow: 'hidden',
  },
  slidingContainer: {
    flexDirection: 'row',
    width: width * 3,
    flex: 1,
  },
  bottomPadding: {
    height: 80,
  },
});

export default PartnerPropertyForm;
