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
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
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
import {useDialog} from '../../hooks/useDialog';
import AuthService from '../../services/AuthService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Roles, {RoleTypes} from '../../constants/Roles';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Images from '../../constants/Images';
import LinearGradient from 'react-native-linear-gradient';
import GetIcon from '../../components/GetIcon';
import { useMaster } from '../../context/MasterProvider';
import { MasterDetailModel } from '../../types';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormType, string>>
  >({});
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {keyboardVisible} = useKeyboard();
  const {showError} = useDialog();
  const {masterData} = useMaster();

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
    phone: '',
  };

  const handleLocationChange = async (
    field: keyof SignupFormType,
    value: string | boolean,
  ) => {
    if (typeof value !== 'string') {
      return;
    }
    handleFieldChange(field, value);

    if (value.length >= 2) {
      setIsLoadingLocations(true);
      try {
        const response = await AuthService.getPlaces(value, 'Noida');
        if (response?.predictions) {
          // Convert predictions to string array
          const suggestions = response.predictions.map(
            (prediction: any) => prediction.description,
          );
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
  const handleLocationSelect = (suggestion: string) => {
    handleFieldChange('location', suggestion);
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
        const fieldError = error.errors[0]?.message || 'Invalid input';
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
          error.errors.forEach(err => {
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
      handleInputChange(field, value);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.MT_PRIMARY_1}
        barStyle="light-content"
      />

      {/* Header */}
      <LinearGradient
        colors={[Colors.MT_PRIMARY_1, '#1e5799']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}>
            <GetIcon iconName="back" color="white" size="24" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Sign Up as {route.params.role}</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

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

                <View style={styles.actionsSection}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSubmit}
                    disabled={isLoading || loading}>
                    <LinearGradient
                      colors={
                        isLoading || loading
                          ? ['#a8c7f0', '#b8e0f7'] // Light blue gradient for disabled state
                          : ['#3a7bd5', '#00d2ff']
                      }
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.buttonGradient}>
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
                    </LinearGradient>
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
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonGradient: {
    borderRadius: 15,
    paddingVertical: 15,
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
    color: Colors.MT_SECONDARY_3,
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
});

export default SignUpScreen;
