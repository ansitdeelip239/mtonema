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
  StatusBar,
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
import LinearGradient from 'react-native-linear-gradient';
import GetIcon from '../../components/GetIcon';
import {useKeyboard} from '../../hooks/useKeyboard';
import Roles from '../../constants/Roles';
import Images from '../../constants/Images';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;

const EmailScreen: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{
    message: string;
    isClickable?: boolean;
  }>({message: '', isClickable: false});

  // Use the keyboard hook to track keyboard status
  const {keyboardVisible} = useKeyboard();

  const {setNavigateToPostProperty} = useAuth();
  const {showError} = useDialog();
  const {role, location} = route.params;
  const [partnerInfo, setPartnerInfo] = useState<{
    imageUrl?: string;
    name?: string;
    domain?: string;
  }>({});

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

  const logoHeight = useRef(new Animated.Value(200)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const logoMarginTop = useRef(new Animated.Value(0)).current;

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
            message: response.message || 'Email verification failed',
            isClickable: false,
          });
          return false;
        }

        if (response && !role.includes(response.data?.userType as string)) {
          showError('Email not found');
          return false;
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setEmailError({message: errorMessage, isClickable: false});
        return false;
      }
    },
    [role, showError],
  );

  // Add this after your keyboard hook usage
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
        Animated.timing(logoMarginTop, {
          toValue: -30, // Move it slightly up as it collapses
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animate logo sliding down and fading in
      Animated.parallel([
        Animated.timing(logoHeight, {
          toValue: 200,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(logoMarginTop, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [keyboardVisible, logoHeight, logoOpacity, logoMarginTop]);

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

        const response = await AuthService.otpVerification(formInput.email);
        if (response.success) {
          navigation.navigate('OtpScreen', {email: formInput.email});
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
    [formInput, checkEmail, navigation, setNavigateToPostProperty, showError],
  );

  const handleVerifyNow = useCallback(() => {
    handleOtpVerification(true);
  }, [handleOtpVerification]);

  const handleContinue = useCallback(() => {
    handleOtpVerification();
  }, [handleOtpVerification]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.MT_PRIMARY_1}
        barStyle="light-content"
      />

      <LinearGradient
        colors={[Colors.MT_PRIMARY_1, '#1e5799']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}>
            <GetIcon iconName="back" color="white" size="24" />
          </TouchableOpacity>
          {route.params.role.includes(Roles.PARTNER) ? (
            <Text style={styles.headerText}>Partner Sign In</Text>
          ) : (
            <Text style={styles.headerText}>Buyer/Seller Sign In</Text>
          )}
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

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
                marginTop: logoMarginTop,
                overflow: 'hidden' as const,
              },
            ]}>
            {partnerInfo.imageUrl ? (
              <Image
                source={{uri: partnerInfo.imageUrl}}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={Images.MTESTATES_LOGO}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
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
              {emailError.isClickable ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleVerifyNow}
                  disabled={isLoading || formLoading}>
                  <LinearGradient
                    colors={
                      isLoading || formLoading
                        ? ['#a8c7f0', '#b8e0f7'] // Light blue gradient for disabled state
                        : ['#3a7bd5', '#00d2ff']
                    }
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
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
              ) : (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleContinue}
                  disabled={!formInput.email || isLoading || formLoading}>
                  <LinearGradient
                    colors={
                      !formInput.email || isLoading || formLoading
                        ? ['#a8c7f0', '#b8e0f7'] // Light blue gradient for disabled state
                        : ['#3a7bd5', '#00d2ff']
                    } // Regular blue gradient for active state
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
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
                            !formInput.email || formLoading
                              ? '#ffffff80'
                              : 'white'
                          }
                          size="20"
                        />
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.signupText} onPress={() => navigation.goBack()}>
            Sign Up
          </Text>
        </Text>
      </View>

      <Toast />
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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: width * 0.8,
    height: 200,
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
    color: Colors.MT_SECONDARY_3, // Semi-transparent white for disabled state
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
  signupText: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold',
  },
});

export default EmailScreen;
