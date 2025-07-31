import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import { useDialog } from '../../hooks/useDialog';
import { MaterialTextInput } from '../../components/MaterialTextInput';
import useForm from '../../hooks/useForm';
import { EmailFormData, emailSchema } from '../../schema/LoginSchema';
import LinearGradient from 'react-native-linear-gradient';
import GetIcon from '../../components/GetIcon';
import { useKeyboard } from '../../hooks/useKeyboard';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';
import HeaderComponent from './components/HeaderComponent';
import config from '../../config';
import { darkenColor, lightenColor } from '../../utils/colorUtils';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{
    message: string;
    isClickable?: boolean;
  }>({ message: '', isClickable: false });

  // Use the keyboard hook to track keyboard status
  const { keyboardVisible } = useKeyboard();

  const { setNavigateToPostProperty } = useAuth();
  const { showError } = useDialog();
  const { role, location } = route.params;
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

  // Parse the location description JSON on component mount
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

  // Derive header colors from partner info or use MT_PRIMARY/SECONDARY as fallback
  const headerGradientColors = useMemo(() => {
    if (
      partnerInfo.colorScheme?.primaryColor &&
      partnerInfo.colorScheme?.secondaryColor
    ) {
      return [
        partnerInfo.colorScheme.primaryColor,
        partnerInfo.colorScheme.secondaryColor,
      ];
    }
    return [Colors.MT_PRIMARY_1, Colors.MT_SECONDARY_1];
  }, [partnerInfo.colorScheme]);

  // Animation values for logo
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
        setEmailError({ message: '', isClickable: false });
        const response = await AuthService.verifyLoginInput(emailToCheck);

        if (!response.success) {
          setEmailError({
            message: response.message || 'Email verification failed',
            isClickable: false,
          });
          return false;
        }

        if (response && !role.includes(response.data?.userType as string)) {
          setEmailError({
            message: 'Email not found',
            isClickable: false,
          });
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setEmailError({ message: errorMessage, isClickable: false });
        return false;
      }
    },
    [role],
  );

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

  const handleOtpVerification2 = useCallback(async () => {
    navigation.navigate('OtpScreen', {
      email: formInput.email,
      logoUrl: partnerInfo.imageUrl,
      ...(location ? { location } : {}),
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
          showError(response.message || 'Failed to send OTP. Please try again');
        }
      } catch (error) {
        showError('An error occurred while sending OTP.');
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
    ],
  );

  // Choose which handler to use based on environment
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

  // Get button background color
  const getButtonBackgroundColor = () => {
    if (!formInput.email || isLoading || formLoading) {
      return '#CCCCCC'; // Disabled gray
    }
    return partnerInfo.colorScheme?.primaryColor || Colors.MT_PRIMARY_1;
  };

  const renderButton = () => {
    if (emailError.isClickable) {
      // Verify Now Button
      if (isIOS) {
        return (
          <TouchableOpacity
            style={[styles.simpleIOSButton, { backgroundColor: getButtonBackgroundColor() }]}
            onPress={handleVerifyNow}
            disabled={isLoading || formLoading}
            activeOpacity={0.8}>
            <Text style={styles.simpleIOSButtonText}>
              {isLoading ? 'Verifying...' : 'Verify Now'}
            </Text>
          </TouchableOpacity>
        );
      } else {
        // Android fancy button
        return (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleVerifyNow}
            disabled={isLoading || formLoading}>
            <LinearGradient
              colors={
                isLoading || formLoading
                  ? partnerInfo.colorScheme?.primaryColor
                    ? [
                        lightenColor(partnerInfo.colorScheme.primaryColor, 0.4),
                        lightenColor(partnerInfo.colorScheme.primaryColor, 0.2),
                      ]
                    : ['#a8c7f0', '#b8e0f7']
                  : partnerInfo.colorScheme?.primaryColor
                    ? [
                        partnerInfo.colorScheme.primaryColor,
                        darkenColor(partnerInfo.colorScheme.primaryColor, 0.2),
                      ]
                    : headerGradientColors
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <Text
                style={[
                  styles.buttonText,
                  (isLoading || formLoading) && styles.disabledButtonText,
                ]}>
                {isLoading ? 'Verifying...' : 'Verify Now'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      }
    } else {
      // Continue Button
      if (isIOS) {
        return (
          <TouchableOpacity
            style={[styles.simpleIOSButton, { backgroundColor: getButtonBackgroundColor() }]}
            onPress={handleContinue}
            disabled={!formInput.email || isLoading || formLoading}
            activeOpacity={0.8}>
            <View style={styles.simpleIOSButtonContent}>
              <Text style={styles.simpleIOSButtonText}>
                {isLoading ? 'Sending OTP...' : 'Continue'}
              </Text>
              {!isLoading && (
                <GetIcon
                  iconName="chevronRight"
                  color={!formInput.email || formLoading ? '#ffffff80' : 'white'}
                  size="20"
                />
              )}
            </View>
          </TouchableOpacity>
        );
      } else {
        // Android fancy button
        return (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            disabled={!formInput.email || isLoading || formLoading}>
            <LinearGradient
              colors={
                !formInput.email || isLoading || formLoading
                  ? partnerInfo.colorScheme?.primaryColor
                    ? [
                        lightenColor(partnerInfo.colorScheme.primaryColor, 0.4),
                        lightenColor(partnerInfo.colorScheme.primaryColor, 0.2),
                      ]
                    : [
                        lightenColor(Colors.MT_PRIMARY_1, 0.4),
                        lightenColor(Colors.MT_PRIMARY_1, 0.4),
                      ]
                  : partnerInfo.colorScheme?.primaryColor
                    ? [
                        partnerInfo.colorScheme.primaryColor,
                        darkenColor(partnerInfo.colorScheme.primaryColor, 0.2),
                      ]
                    : headerGradientColors
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <View style={styles.buttonContentWrapper}>
                <Text
                  style={[
                    styles.buttonText,
                    (!formInput.email || isLoading || formLoading) &&
                    styles.disabledButtonText,
                  ]}>
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </Text>
                {!isLoading && (
                  <GetIcon
                    iconName="chevronRight"
                    color={
                      !formInput.email || formLoading ? '#ffffff80' : 'white'
                    }
                    size="20"
                  />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {!isIOS && (
        <HeaderComponent
          title={
            route.params.role.includes(Roles.PARTNER)
              ? 'Partner Sign In'
              : 'Buyer/Seller Sign In'
          }
          showBackButton={true}
          onBackPress={navigation.goBack}
          gradientColors={headerGradientColors}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <View style={styles.mainContent}>
          {/* Only show logo when keyboard is not visible */}
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
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Please enter your email address to continue
              </Text>
            </View>

            <View style={styles.inputSection}>
              <MaterialTextInput
                label="Email"
                placeholder="Enter your email address"
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

            <View style={styles.actionsSection}>
              {renderButton()}
            </View>
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
        shadowOffset: { width: 0, height: 5 },
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

  // Android fancy button styles
  primaryButton: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
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

  // Simple iOS button styles
  simpleIOSButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  simpleIOSButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simpleIOSButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 8,
  },
});

export default EmailScreen;
