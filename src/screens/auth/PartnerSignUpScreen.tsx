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
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MaterialTextInput} from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import {z} from 'zod';
import Colors from '../../constants/Colors';
import {useKeyboard} from '../../hooks/useKeyboard';
import AuthService from '../../services/AuthService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Roles from '../../constants/Roles';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import Images from '../../constants/Images';
import GetIcon from '../../components/GetIcon';
import {useMaster} from '../../context/MasterProvider';
import HeaderComponent from './components/HeaderComponent';
import {lightenColor} from '../../utils/colorUtils';
import PartnerZoneSelector from '../../components/PartnerZoneSelector';
import PartnerSignUpFormSchema, {
  PartnerSignupFormType,
  partnerSignupSubmissionSchema,
} from '../../schema/PartnerSignUpFormSchema';
import {useDialog} from '../../context/DialogProvider';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'PartnerSignUpScreen'>;

const PartnerSignUpScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const [errors, setErrors] = useState<
    Partial<Record<keyof PartnerSignupFormType, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {keyboardVisible} = useKeyboard();
  const {showError} = useDialog();
  const {masterData} = useMaster();

  // Animation values for logo
  const logoHeight = useRef(new Animated.Value(150)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  const isIOS = Platform.OS === 'ios';

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

  const initialState: PartnerSignupFormType = {
    name: '',
    email: '',
    phone: '',
    partnerZone: '',
  };

  const validateField = (field: keyof PartnerSignupFormType, value: string) => {
    try {
      const fieldSchema = PartnerSignUpFormSchema.pick({
        [field]: true,
      } as Record<typeof field, true>);
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
  } = useForm<PartnerSignupFormType>({
    initialState,
    onSubmit: async formData => {
      setIsLoading(true);
      try {
        const validatedData = PartnerSignUpFormSchema.parse(formData);
        const signupData = partnerSignupSubmissionSchema(
          Roles.PARTNER,
          validatedData.partnerZone,
        ).parse(validatedData);

        let response;
        try {
          response = await AuthService.partnerSignUp(signupData);
        } catch (apiError: any) {
          // Handle API errors that were thrown due to success: false
          console.log('API Error caught:', apiError);

          // Check if this is a 409 conflict error
          if (apiError.message && apiError.message.includes('already exists')) {
            showError(t('auth.signUp.partner.errors.accountExists'));
            navigation.navigate('EmailScreen', {
              role: [Roles.PARTNER],
              location: null,
            });
            return;
          }

          // For other API errors, show the error message from the API
          showError(
            apiError.message || t('auth.signUp.partner.errors.checkInput'),
          );
          return;
        }

        if (response.success) {
          // Store email for later use
          setUserEmail(formData.email);

          try {
            const masterDescription = masterData?.PartnerLocation?.find(
              masterDetail => {
                return masterDetail.masterDetailName === formData.partnerZone;
              },
            )?.description;

            if (masterDescription) {
              const domain = JSON.parse(masterDescription).domain;

              // Send Message to Officials
              await AuthService.getInTouch({
                subject: 'New Partner Signup',
                message: `A new partner has signed up with email: ${formData.email}`,
                email: formData.email,
                name: formData.name,
                phone: formData.phone || '',
                domain: domain,
              });
            }
          } catch (domainError) {
            console.error(
              'Error processing domain or sending notification:',
              domainError,
            );
            // Continue with the flow even if domain processing fails
          }

          // Call OTP verification
          await AuthService.otpVerification(formData.email);

          // Show trial modal for Android, directly proceed for iOS
          if (!isIOS) {
            setShowTrialModal(true);
          } else {
            // For iOS, directly navigate to OTP screen
            navigation.navigate('OtpScreen', {email: userEmail});
          }
        } else {
          showError(response.message);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Partial<
            Record<keyof PartnerSignupFormType, string>
          > = {};
          error.issues.forEach(err => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof PartnerSignupFormType] =
                err.message;
            }
          });
          setErrors(newErrors);
        } else {
          showError(t('auth.signUp.partner.errors.generic'));
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFieldChange = (
    field: keyof PartnerSignupFormType,
    value: string | boolean,
  ) => {
    if (typeof value === 'string') {
      validateField(field, value);
      handleInputChange(field, value);
    }
  };

  // Get button background color based on state
  const getButtonBackgroundColor = () => {
    const isDisabled = isLoading || loading;
    return isDisabled
      ? lightenColor(Colors.MT_PRIMARY_1, 0.4)
      : Colors.MT_PRIMARY_1;
  };

  // Handle continue from trial modal
  const handleTrialModalContinue = () => {
    setShowTrialModal(false);
    navigation.navigate('OtpScreen', {email: userEmail});
  };

  return (
    <View style={styles.container}>
      {!isIOS && (
        <HeaderComponent
          title={t('auth.signUp.title')}
          onBackPress={navigation.goBack}
          showBackButton={true}
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
                <Text style={styles.welcomeTitle}>
                  {t('auth.signUp.partner.welcomeTitle')}
                </Text>
                {/* <Text style={styles.welcomeSubtitle}>
                  Please fill in your details to get started
                </Text> */}
              </View>

              <View style={styles.formContainer}>
                <MaterialTextInput<PartnerSignupFormType>
                  label={t('auth.signUp.partner.nameLabel')}
                  field="name"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder={t('auth.signUp.partner.namePlaceholder')}
                  errorMessage={errors.name}
                />

                <View style={styles.inputSpacing} />

                <MaterialTextInput<PartnerSignupFormType>
                  label={t('auth.signUp.partner.emailLabel')}
                  field="email"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder={t('auth.signUp.partner.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email}
                />

                <View style={styles.inputSpacing} />

                <MaterialTextInput<PartnerSignupFormType>
                  label={t('auth.signUp.partner.phoneLabel')}
                  field="phone"
                  formInput={formInput}
                  setFormInput={handleFieldChange}
                  mode="outlined"
                  placeholder={t('auth.signUp.partner.phonePlaceholder')}
                  keyboardType="number-pad"
                  maxLength={10}
                  errorMessage={errors.phone}
                />

                <View style={styles.inputSpacing} />

                {/* Partner Zone Selection */}
                <PartnerZoneSelector
                  partnerLocations={masterData?.PartnerLocation || []}
                  selectedZone={formInput.partnerZone}
                  onZoneSelect={zoneName =>
                    handleFieldChange('partnerZone', zoneName)
                  }
                  errorMessage={errors.partnerZone}
                />

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
                          ? t('auth.signUp.partner.creatingAccount')
                          : t('auth.signUp.partner.signUpButton')}
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
                {t('auth.signUp.partner.alreadyHaveAccount')}{' '}
                <Text
                  style={styles.loginText}
                  onPress={() =>
                    navigation.navigate('EmailScreen', {
                      role: [Roles.PARTNER],
                      location: null,
                    })
                  }>
                  {t('auth.signUp.partner.logIn')}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Trial Account Modal */}
      <Modal
        visible={showTrialModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTrialModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t('auth.signUp.partner.trialModal.title')}
              </Text>
              <Text style={styles.modalMessage}>
                {t('auth.signUp.partner.trialModal.message')}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleTrialModalContinue}
                activeOpacity={0.8}>
                <Text style={styles.modalButtonText}>
                  {t('auth.signUp.partner.trialModal.continue')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 32,
    width: '80%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    minWidth: 120,
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
  modalButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PartnerSignUpScreen;
