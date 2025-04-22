import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  PartnerPropertyApiSubmissionType,
  PartnerPropertyFormType,
} from '../../../../schema/PartnerPropertyFormSchema';
import {useAuth} from '../../../../hooks/useAuth';
import {usePartner} from '../../../../context/PartnerProvider';
import useForm from '../../../../hooks/useForm';
import {initialFormState} from '../../../../utils/partner-property-form-initial-state';
import PartnerService from '../../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import Header from '../../../../components/Header';
import {PartnerDrawerParamList} from '../../../../types/navigation';
import FormStepper from './components/FormStepper';
import BasicDetailsStep from './BasicDetailsStep';
import PropertyDetailsStep from './PropertyDetailsStep';
import MediaAndSubmitStep from './MediaAndSubmitStep';
import {Property} from '../../ListingsScreen/types';

const {width} = Dimensions.get('window');
const steps = ['Basic Info', 'Property Details', 'Media & Submit'];

type PartnerPropertyFormProps = {
  editMode?: boolean;
  propertyData?: Property;
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
  const [currentStep, setCurrentStep] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const {user} = useAuth();
  const {setPartnerPropertyUpdated} = usePartner();

  // Create refs for each ScrollView
  const scrollViewRefs = useRef<(ScrollView | null)[]>([null, null, null]);

  const propertyDataMapping = React.useMemo<PartnerPropertyFormType>(() => ({
    isFeatured: propertyData?.featured ?? null,
    sellerType: propertyData?.sellerType ?? null,
    location: propertyData?.location ?? null,
    city: propertyData?.city ?? null,
    zipCode: propertyData?.zipCode ?? null,
    propertyName: propertyData?.propertyName ?? null,
    price: propertyData?.price ?? null,
    propertyFor: propertyData?.propertyFor ?? null,
    propertyType: propertyData?.propertyType ?? null,
    imageURL: propertyData?.imageURL ?? null,
    videoURL: propertyData?.videoURL ?? null,
    shortDescription: propertyData?.shortDescription ?? null,
    longDescription: propertyData?.longDescription ?? null,
    readyToMove: propertyData?.readyToMove ?? null,
    furnishing: propertyData?.furnishing ?? null,
    parking: propertyData?.parking ?? null,
    propertyAge: propertyData?.propertyAge ?? null,
    facing: propertyData?.facing ?? null,
    tags: propertyData?.tags ?? null,
    alarmSystem: propertyData?.alarmSystem ?? null,
    surveillanceCameras: propertyData?.surveillanceCameras ?? null,
    gatedSecurity: propertyData?.gatedSecurity ?? null,
    ceilingHeight: propertyData?.ceilingHeight ?? null,
    pantry: propertyData?.pantry ?? null,
    boundaryWall: propertyData?.boundaryWall ?? null,
    constructionDone: propertyData?.constructionDone ?? null,
    bhkType: propertyData?.bhkType ?? null,
    propertyForType: propertyData?.propertyForType ?? null,
    area: propertyData?.area ?? null,
    lmUnit: propertyData?.lmUnit ?? null,
    floor: Number(propertyData?.floor) ?? null,
    openSide: propertyData?.openSide ?? null,
    lifts: propertyData?.lifts ?? null,
  }), [propertyData]);

  const {
    formInput,
    handleInputChange,
    handleSelect,
    onSubmit,
    loading,
    resetForm,
    setFormInput,
  } = useForm<PartnerPropertyFormType>({
    initialState:
      editMode && propertyData ? propertyDataMapping : initialFormState,
    onSubmit: async data => {
      try {
        const payload: PartnerPropertyApiSubmissionType = {
          ...data,
          userId: user?.id as number,
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

  useEffect(() => {
    if (editMode && propertyData) {
      setCurrentStep(0);

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
  }, [editMode, propertyDataMapping, setFormInput, animatedValue, slideAnimation, propertyData]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      Animated.timing(animatedValue, {
        toValue: currentStep + 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnimation, {
        toValue: (currentStep + 1) * -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);

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
      Animated.timing(animatedValue, {
        toValue: currentStep - 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnimation, {
        toValue: (currentStep - 1) * -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);

        const prevScrollView = scrollViewRefs.current[currentStep - 1];
        if (prevScrollView) {
          prevScrollView.scrollTo({x: 0, y: 0, animated: true});
        }
      });
    }
  };

  const completeReset = () => {
    setFormInput(initialFormState);
    setCurrentStep(0);
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

  const ClearButton = (
    <TouchableOpacity onPress={completeReset} style={styles.clearButton}>
      <Text style={styles.clearButtonText}>Clear</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title={headerTitle}>{ClearButton}</Header>

      <View style={styles.stepperContainer}>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          animatedValue={animatedValue}
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
                  submitButtonText={submitButtonText}
                />
              </View>
            </ScrollView>
          </View>
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
    height: 80,
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#f00',
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PartnerPropertyForm;
