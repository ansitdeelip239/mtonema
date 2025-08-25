import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import {useDialog} from '../../hooks/useDialog';
import {MaterialTextInput} from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import {EmailFormData, emailSchema} from '../../schema/LoginSchema';
import GetIcon from '../../components/GetIcon';
import {useKeyboard} from '../../hooks/useKeyboard';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';
import HeaderComponent from './components/HeaderComponent';
import config from '../../config';
import {lightenColor} from '../../utils/colorUtils';
import { useTranslation } from 'react-i18next';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();

  // ✅ Define all translations at the top using useMemo
  const translations = React.useMemo(
    () => ({
      partnerSignIn: t('auth.signIn.partner'),
      buyerSellerSignIn: t('auth.signIn.buyerSeller'),
      welcomeBack: t('greetings.welcomeBack'),
      enterEmailToContinue: t('auth.email.enterToContinue'),
      email: t('common.labels.email'),
      emailPlaceholder: t('auth.email.placeholder'),
      continue: t('common.actions.next'),
      sendingOtp: t('common.states.sending'),
      verifyNow: t('auth.otp.verify'),
      verifying: t('common.states.verifying'),
      emailNotFound: t('errors.emailNotFound'),
      emailVerificationFailed: t('errors.emailVerificationFailed'),
      failedToSendOtp: t('errors.failedToSendOtp'),
      errorSendingOtp: t('errors.failedToSendOtp'),
      unexpectedError: t('errors.unexpectedError'),
    }),
    [t]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{
    message: string;
    isClickable?: boolean;
  }>({message: '', isClickable: false});

  const {keyboardVisible} = useKeyboard();
  const {setNavigateToPostProperty} = useAuth();
  const {showError} = useDialog();
  const {role, location} = route.params;
  const [partnerInfo, setPartnerInfo] = useState<{
    imageUrl?: string;
    name?: string;
    domain?: string;
    colorScheme?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
  }>({});

  const isIOS = Platform.OS === 'ios';

  useEffect(() => {
    try {
      if (location && location.description) {
        const parsedDescription = JSON.parse(location.description);
        setPartnerInfo(parsedDescription);
        console.log('Parsed location info:', parsedDescription);
      }
    } catch (error) {
      console.error('Failed to parse location description:', error);
    }
  }, [location]);

  const logoHeight = useRef(new Animated.Value(150)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  const onSubmit = async (_data: EmailFormData) => {
    // This is just to maintain the form submission structure
  };

  const {
    formInput,
    handleInputChange,
    loading: formLoading,
  } = useForm<EmailFormData>({
    initialState: {
      email: '',
    },
    onSubmit,
  });

  const checkEmail = useCallback(
    async (emailToCheck: string) => {
      try {
        setEmailError({message: '', isClickable: false});
        const response = await AuthService.verifyLoginInput(emailToCheck);

        if (!response.success) {
          setEmailError({
            message: response.message || translations.emailVerificationFailed,
            isClickable: false,
          });
          return false;
        }

        if (response && !role.includes(response.data?.userType as string)) {
          setEmailError({
            message: translations.emailNotFound,
            isClickable: false,
          });
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : translations.unexpectedError;
        setEmailError({message: errorMessage, isClickable: false});
        return false;
      }
    },
    [role, translations],
  );

  useEffect(() => {
    if (keyboardVisible) {
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

  const handleOtpVerification2 = useCallback(async () => {
    navigation.navigate('OtpScreen', {
      email: formInput.email,
      logoUrl: partnerInfo.imageUrl,
      ...(location ? {location} : {}),
    });
  }, [formInput.email, location, navigation, partnerInfo.imageUrl]);

  const handleOtpVerification = useCallback(
    async (skipEmailCheck = false) => {
      const validationResult = emailSchema.safeParse(formInput);
      if (!validationResult.success) {
        setEmailError({
          message: validationResult.error.errors[0].message,
          isClickable: false,
        });
        return;
      }

      setIsLoading(true);
      try {
        if (!skipEmailCheck) {
          const isValidEmail = await checkEmail(formInput.email);
          if (!isValidEmail) {
            setIsLoading(false);
            return;
          }
        }

        const response = await AuthService.otpVerification(
          formInput.email,
          undefined,
          location && location.description
            ? JSON.parse(location.description).domain
            : undefined,
        );
        if (response.success) {
          navigation.navigate('OtpScreen', {
            email: formInput.email,
            logoUrl: partnerInfo.imageUrl,
            location: location ?? undefined,
          });
          if (!skipEmailCheck) {
            setNavigateToPostProperty(false);
          }
        } else {
          showError(response.message || translations.failedToSendOtp);
        }
      } catch (error) {
        showError(translations.errorSendingOtp);
      } finally {
        setIsLoading(false);
      }
    },
    [
      formInput,
      checkEmail,
      navigation,
      setNavigateToPostProperty,
      showError,
      partnerInfo.imageUrl,
      location,
      translations,
    ],
  );

  const handleContinue = useCallback(() => {
    if (config.environment === 'development') {
      handleOtpVerification2();
    } else {
      handleOtpVerification();
    }
  }, [handleOtpVerification, handleOtpVerification2]);

  const handleVerifyNow = useCallback(() => {
    handleOtpVerification(true);
  }, [handleOtpVerification]);

  const getButtonBackgroundColor = (isDisabled: boolean) => {
    if (isDisabled) {
      return partnerInfo.colorScheme?.primaryColor
        ? lightenColor(partnerInfo.colorScheme.primaryColor, 0.3)
        : '#CCCCCC';
    }
    return partnerInfo.colorScheme?.primaryColor || Colors.MT_PRIMARY_1;
  };

  const renderButton = () => {
    if (emailError.isClickable) {
      const isDisabled = isLoading || formLoading;
      return (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {backgroundColor: getButtonBackgroundColor(isDisabled)},
          ]}
          onPress={handleVerifyNow}
          disabled={isDisabled}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.buttonText,
              isDisabled && styles.disabledButtonText,
            ]}>
            {isLoading ? translations.verifying : translations.verifyNow}
          </Text>
        </TouchableOpacity>
      );
    } else {
      const isDisabled = !formInput.email || isLoading || formLoading;
      return (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {backgroundColor: getButtonBackgroundColor(isDisabled)},
          ]}
          onPress={handleContinue}
          disabled={isDisabled}
          activeOpacity={0.8}>
          <View style={styles.buttonContentWrapper}>
            <Text
              style={[
                styles.buttonText,
                isDisabled && styles.disabledButtonText,
              ]}>
              {isLoading ? translations.sendingOtp : translations.continue}
            </Text>
            {!isLoading && (
              <GetIcon
                iconName="chevronRight"
                color={isDisabled ? '#ffffff80' : 'white'}
                size="20"
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {!isIOS && (
        <HeaderComponent
          title={
            route.params.role.includes(Roles.PARTNER)
              ? translations.partnerSignIn
              : translations.buyerSellerSignIn
          }
          showBackButton={true}
          onBackPress={navigation.goBack}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <View style={styles.mainContent}>
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

          <View style={styles.formCard}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                {translations.welcomeBack}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {translations.enterEmailToContinue}
              </Text>
            </View>

            <View style={styles.inputSection}>
              <MaterialTextInput
                label={translations.email}
                placeholder={translations.emailPlaceholder}
                field="email"
                formInput={formInput}
                setFormInput={handleInputChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                mode="outlined"
                errorMessage={emailError.message}
              />
            </View>

            <View style={styles.actionsSection}>{renderButton()}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  logo: {
    width: width * 0.7,
    height: 150,
    mixBlendMode: 'multiply',
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
  inputSection: {
    marginBottom: 24,
  },
  actionsSection: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
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
});

export default EmailScreen;
