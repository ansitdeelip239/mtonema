import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PartnerPropertyApiSubmissionType } from '../../../../schema/PartnerPropertyFormSchema';
import useForm from '../../../../hooks/useForm';
import { initialFormState } from '../../../../utils/partner-property-form-initial-state';
import SellerService from '../../../../services/SellerService';
import MasterService from '../../../../services/MasterService';
import Toast from 'react-native-toast-message';
import InlineHeader from '../../../../components/InlineHeader';
import FormStepper from '../../../partner/components/PartnerPropertyForm/components/FormStepper';
import { useTheme } from '../../../../context/ThemeProvider';

// Import modular components
import FormStepContainer from '../../../partner/components/PartnerPropertyForm/components/FormStepContainer';
import ClearFormButton from '../../../partner/components/PartnerPropertyForm/components/ClearFormButton';
import { useFormNavigation } from '../../../partner/components/PartnerPropertyForm/hooks/useFormNavigation';
import { useFormValidation } from '../../../partner/components/PartnerPropertyForm/hooks/useFormValidation';

// Import step components
import BasicDetailsStep from '../../../partner/components/PartnerPropertyForm/steps/BasicDetailsStep';
import PropertyDetailsStep from '../../../partner/components/PartnerPropertyForm/steps/PropertyDetailsStep';
import MediaAndSubmitStep from '../../../partner/components/PartnerPropertyForm/steps/MediaAndSubmitStep';
import { usePropertyDataMapping } from '../../../partner/components/PartnerPropertyForm/hooks/usePropertyDataMapping';
import { useAuth } from '../../../../context/AuthProvider';

const { width } = Dimensions.get('window');

type SellerPropertyFormProps = {
  editMode?: boolean;
  propertyData?: any;
  headerTitle: string;
  submitButtonText: string;
  navigation: any;
};

const SellerPropertyForm: React.FC<SellerPropertyFormProps> = ({
  editMode = false,
  propertyData,
  headerTitle,
  submitButtonText,
  navigation,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Get translated steps
  const steps = [
    t('partnerPropertyForm.steps.basicInfo', 'Basic Info'),
    t('partnerPropertyForm.steps.propertyDetails', 'Property Details'),
    t('partnerPropertyForm.steps.mediaAndSubmit', 'Media & Submit'),
  ];

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
          response = await SellerService.updateProperty(payload);
        } else {
          response = await SellerService.addProperty(payload);
        }

        if (response.success) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? t('sellerPropertyForm.success.propertyUpdated', 'Property updated successfully')
              : t('sellerPropertyForm.success.propertyAdded', 'Property added successfully'),
          });

          completeReset();

          navigation.reset({
            index: 0,
            routes: [{ name: 'Property', params: { screen: 'PropertyList' } }],
          });
        }
      } catch (error) {
        console.error('Error submitting property data:', error);
        Toast.show({
          type: 'error',
          text1: editMode
            ? t('sellerPropertyForm.errors.updateFailed', 'Failed to update property')
            : t('sellerPropertyForm.errors.addFailed', 'Failed to add property'),
          text2: t('sellerPropertyForm.errors.tryAgain', 'Please try again later.'),
        });
      }
    },
  });

  // Fetch and set videoURL from master details if available
  useEffect(() => {
    async function fetchVideoUrl() {
      if (user?.partnerLocation) {
        try {
          const response = await MasterService.getMasterDetailsById(user.partnerLocation);

          if (response?.data?.description) {
            try {
              const descriptionData = JSON.parse(response.data.description);
              if (descriptionData?.tourVideo) {
                setFormInput({
                  ...formInput,
                  videoURL: descriptionData.tourVideo,
                });
              }
            } catch (e) {
              console.error('Error parsing master description:', e);
            }
          }
        } catch (err) {
          // Optionally handle error
        }
      }
    }
    fetchVideoUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.partnerLocation]);

  // Use form validation hook
  const { validateStep } = useFormValidation(formInput);

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
      {
        Platform.OS === 'android' && (
          <InlineHeader
            title={headerTitle}>
            <ClearFormButton
              onPress={completeReset}
              backgroundColor={theme.secondaryColor}
            />
          </InlineHeader>
        )
      }

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
            { transform: [{ translateX: slideAnimation }] },
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
        shadowOffset: { width: 0, height: 2 },
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

export default SellerPropertyForm;
