import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import {MaterialTextInput} from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import SignUpFormSchema, {
  SignupFormType,
  signupSubmissionSchema,
} from '../../schema/SignUpFormSchema';
import {z} from 'zod';
import Colors from '../../constants/Colors';
import {useKeyboard} from '../../hooks/useKeyboard';
import AuthService from '../../services/AuthService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Roles, {RoleTypes} from '../../constants/Roles';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Images from '../../constants/Images';
import GetIcon from '../../components/GetIcon';
import {useMaster} from '../../context/MasterProvider';
import {MasterDetailModel} from '../../types';
import HeaderComponent from './components/HeaderComponent';
import {lightenColor} from '../../utils/colorUtils';
import {useDialog} from '../../context/DialogProvider';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormType, string>>
  >({});
  const [locationSuggestions, setLocationSuggestions] = useState<
    Array<{description: string; placeId: string}>
  >([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {keyboardVisible} = useKeyboard();
  const {showError} = useDialog();
  const {masterData} = useMaster();
  const isIOS = Platform.OS === 'ios';

  // Animation values for logo
  const logoHeight = useRef(new Animated.Value(150)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  // Animate logo on keyboard visibility change
  useEffect(() => {
    if (keyboardVisible) {
      // Animate logo sliding up and fading out
      Animated.parallel([
        Animated.timing(logoHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animate logo sliding down and fading in
      Animated.parallel([
        Animated.timing(logoHeight, {
          toValue: 150,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [keyboardVisible, logoHeight, logoOpacity]);

  const initialState: SignupFormType = {
    name: '',
    email: '',
    location: '',
    placeId: '',
    phone: '',
    acceptTerms: false,
  };

  const handleLocationChange = async (
    field: keyof SignupFormType,
    value: string | boolean,
  ) => {
    if (typeof value !== 'string') {
      return;
    }
    handleFieldChange(field, value);

    // Clear placeId when user types manually (not selecting from suggestions)
    if (field === 'location') {
      handleFieldChange('placeId', '');
    }

    if (value.length >= 2) {
      setIsLoadingLocations(true);
      try {
        const response = await AuthService.getPlaces(value, 'Noida');
        if (response?.predictions) {
          // Store full prediction objects with description and placeId
          const suggestions = response.predictions.map((prediction: any) => ({
            description: prediction.description,
            placeId: prediction.place_id,
          }));
          setLocationSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  // Add a handler for suggestion selection
  const handleLocationSelect = (
    suggestion: string | {description: string; placeId: string},
  ) => {
    if (typeof suggestion === 'string') {
      handleFieldChange('location', suggestion);
      handleFieldChange('placeId', '');
    } else {
      handleFieldChange('location', suggestion.description);
      handleFieldChange('placeId', suggestion.placeId);
    }
    setLocationSuggestions([]);
  };

  const onBuyerSellerLogin = () => {
    const individualLocation = masterData?.PartnerLocation?.find(
      location => location.masterDetailName === 'Individual',
    );

    navigation.navigate('EmailScreen', {
      role: [Roles.BUYER, Roles.SELLER],
      location: individualLocation as MasterDetailModel,
    });
  };

  const validateField = (field: keyof SignupFormType, value: string) => {
    try {
      const fieldSchema = SignUpFormSchema.pick({[field]: true} as Record<
        typeof field,
        true
      >);
      fieldSchema.parse({[field]: value});
      setErrors(prev => ({...prev, [field]: undefined}));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues[0]?.message || 'Invalid input';
        setErrors(prev => ({...prev, [field]: fieldError}));
      }
      return false;
    }
  };

  const {
    formInput,
    handleInputChange,
    loading,
    onSubmit: handleSubmit,
  } = useForm<SignupFormType>({
    initialState,
    onSubmit: async formData => {
      setIsLoading(true);
      try {
        const role = (route.params?.role || Roles.BUYER) as
          | RoleTypes['BUYER']
          | RoleTypes['SELLER'];
        const validatedData = SignUpFormSchema.parse(formData);
        const signupData = signupSubmissionSchema(role).parse(validatedData);

        const response = await AuthService.userSignUp(signupData);

        if (response.success || response.httpStatus === 409) {
          await AuthService.otpVerification(formData.email);
          navigation.navigate('OtpScreen', {email: formData.email});
        } else {
          showError(response.message);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Partial<Record<keyof SignupFormType, string>> = {};
          error.issues.forEach(err => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof SignupFormType] = err.message;
            }
          });
          setErrors(newErrors);
        }
        showError('Please check your input and try again');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFieldChange = (
    field: keyof SignupFormType,
    value: string | boolean,
  ) => {
    if (typeof value === 'string') {
      validateField(field, value);
    }
    handleInputChange(field, value);
  };

  // Get button background color based on state
  const getButtonBackgroundColor = () => {
    const isDisabled = isLoading || loading;
    return isDisabled
      ? lightenColor(Colors.MT_PRIMARY_1, 0.4)
      : Colors.MT_PRIMARY_1;
  };

  return (
    <View style={styles.container}>
      {/* Replace header with HeaderComponent */}

      {!isIOS && (
        <HeaderComponent
          title={`Sign Up as ${route.params.role}`}
          showBackButton={true}
          onBackPress={navigation.goBack}
        />
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Logo with animation */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoOpacity,
                  height: logoHeight,
                  overflow: 'hidden' as const,
                },
              ]}>
              <Image
                source={Images.MTESTATES_LOGO}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Create Account</Text>
                <Text style={styles.welcomeSubtitle}>
                  Please fill in your details to get started
                </Text>
              </View>

              <View style={styles.formContainer}>
                <MaterialTextInput<SignupFormType>
                  label="Full Name*"
                  field="name"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder="Enter your full name"
                  errorMessage={errors.name}
                />

                <View style={styles.inputSpacing} />

                <MaterialTextInput<SignupFormType>
                  label="Email*"
                  field="email"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email}
                />

                <View style={styles.inputSpacing} />

                <MaterialTextInput<SignupFormType>
                  label="Location*"
                  field="location"
                  formInput={formInput}
                  setFormInput={handleLocationChange}
                  mode="outlined"
                  placeholder="Enter your location"
                  errorMessage={errors.location}
                  suggestions={locationSuggestions}
                  onSuggestionSelect={handleLocationSelect}
                  loading={isLoadingLocations}
                />

                <View style={styles.inputSpacing} />

                <MaterialTextInput<SignupFormType>
                  label="Phone Number*"
                  field="phone"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder="Enter your phone number"
                  keyboardType="number-pad"
                  maxLength={10}
                  errorMessage={errors.phone}
                />

                {/* Terms and Conditions Checkbox */}
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() =>
                      handleFieldChange('acceptTerms', !formInput.acceptTerms)
                    }
                    activeOpacity={0.7}>
                    <View
                      style={[
                        styles.checkbox,
                        formInput.acceptTerms && styles.checkboxChecked,
                      ]}>
                      {formInput.acceptTerms && (
                        <GetIcon iconName="checkmark" color="white" size={16} />
                      )}
                    </View>
                    <View style={styles.checkboxTextContainer}>
                      <Text style={styles.checkboxText}>
                        I agree to the{' '}
                        <Text
                          style={styles.linkText}
                          onPress={() =>
                            Linking.openURL('https://mtone.in/terms-conditions')
                          }>
                          Terms and Conditions
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {errors.acceptTerms && (
                    <Text style={styles.checkboxError}>
                      {errors.acceptTerms}
                    </Text>
                  )}
                </View>

                <View style={styles.actionsSection}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      {backgroundColor: getButtonBackgroundColor()},
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading || loading}>
                    <View style={styles.buttonContentWrapper}>
                      <Text
                        style={[
                          styles.buttonText,
                          (isLoading || loading) && styles.disabledButtonText,
                        ]}>
                        {isLoading || loading
                          ? 'Creating Account...'
                          : 'Sign Up'}
                      </Text>
                      {!isLoading && !loading && (
                        <GetIcon
                          iconName="chevronRight"
                          color="white"
                          size="20"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.loginText} onPress={onBuyerSellerLogin}>
                  Log In
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  spacer: {
    width: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.7,
    height: 150,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  welcomeSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputSpacing: {
    height: 16,
  },
  actionsSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 15,
    paddingVertical: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 5,
    textAlign: 'center',
  },
  disabledButtonText: {
    color: Colors.MT_SECONDARY_3 || 'rgba(255,255,255,0.7)',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
  loginText: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.MT_PRIMARY_1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  linkText: {
    color: Colors.MT_PRIMARY_1,
    textDecorationLine: 'underline',
  },
  checkboxError: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 48,
  },
});

export default SignUpScreen;
