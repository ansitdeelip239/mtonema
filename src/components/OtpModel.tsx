/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useDialog } from '../hooks/useDialog';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { useKeyboard } from '../hooks/useKeyboard';
import { lightenColor } from '../utils/colorUtils';
import GetIcon from './GetIcon';

const { width } = Dimensions.get('window');

interface OtpModelProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress: () => void;
  isLoading?: boolean;
  themeColor?: string;
}

const OtpModel: React.FC<OtpModelProps> = ({
  value,
  onChangeText,
  onPress,
  isLoading = false,
  themeColor,
}) => {
  const otpInputRef = useRef(null);
  const { showError } = useDialog();
  const { keyboardVisible } = useKeyboard();

  // Simplified animation values - matching SignUpScreen2
  const logoHeight = useRef(new Animated.Value(150)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  const handleSubmit = () => {
    if (value.length !== 6) {
      showError('Please enter a valid 6-digit OTP.');
      return;
    }
    onPress();
  };

  // Handle logo animation when keyboard shows/hides
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

  // Get button background color based on state and platform
  const getButtonBackgroundColor = () => {
    const isDisabled = value.length !== 6 || isLoading;

    if (isDisabled) {
      return themeColor ? lightenColor(themeColor, 0.3) : '#d3d3d3';
    }

    return themeColor || Colors.MT_PRIMARY_1;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Logo with animation */}
          <View style={styles.contentContainer}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoOpacity,
                  height: logoHeight,
                } as any,
                { overflow: 'hidden' as 'hidden' },
              ]}>
              <Image
                source={Images.MTESTATES_LOGO}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <View style={styles.formCard}>
              <View style={styles.welcomeSection}>
                <Text
                  style={[
                    styles.welcomeTitle,
                    themeColor ? { color: themeColor } : null,
                  ]}>
                  Enter OTP
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  We've sent a 6-digit code to your registered E-mail address
                </Text>
              </View>

              <View style={styles.otpContainer}>
                <OtpInput
                  ref={otpInputRef}
                  numberOfDigits={6}
                  onTextChange={onChangeText}
                  onFilled={onChangeText}
                  theme={{
                    pinCodeContainerStyle: styles.otpBox,
                    focusedPinCodeContainerStyle: StyleSheet.flatten([
                      styles.activeOtpBox,
                      themeColor
                        ? {
                          borderColor: themeColor,
                          backgroundColor: lightenColor(themeColor, 0.9),
                        }
                        : null,
                    ]),
                  }}
                  focusColor={themeColor || Colors.MT_PRIMARY_1}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: getButtonBackgroundColor(),
                  },
                ]}
                onPress={handleSubmit}
                disabled={value.length !== 6 || isLoading}>
                <View style={styles.buttonContentWrapper}>
                  <Text
                    style={[
                      styles.buttonText,
                      (value.length !== 6 || isLoading) && styles.disabledButtonText,
                    ]}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                  {!isLoading && value.length === 6 && (
                    <GetIcon
                      iconName="chevronRight"
                      color="white"
                      size="20"
                    />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't receive the code?{' '}
                  <Text
                    style={[
                      styles.resendLink,
                      themeColor ? { color: themeColor } : null,
                    ]}
                    onPress={() => { }}>
                    Resend OTP
                  </Text>
                </Text>
              </View>
            </View>

            {/* Add padding at the bottom to ensure the card doesn't get hidden by keyboard */}
            <View style={{ height: keyboardVisible ? 120 : 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 0,
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
  otpContainer: {
    marginVertical: 24,
  },
  otpBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 60,
    width: 45,
  },
  activeOtpBox: {
    borderColor: Colors.MT_PRIMARY_1,
    backgroundColor: '#e8f0fe',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 15,
    paddingVertical: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
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
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold',
  },
});

export default OtpModel;
