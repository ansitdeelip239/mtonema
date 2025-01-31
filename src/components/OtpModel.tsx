import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

interface OtpModelProps {
  value: string; // OTP value
  onChangeText: (text: string) => void; // Function to update OTP
  onPress: () => void; // Function to handle OTP submission
  isLoading?: boolean; // Loading state
  apiError?: string; // API error message
  successMessage?:string;
}

const OtpModel: React.FC<OtpModelProps> = ({
  value,
  onChangeText,
  onPress,
  isLoading = false,
  apiError = '',
  successMessage = '',
}) => {
  const [resendTime, setResendTime] = useState(0); // add time resend now button as per your time
  const otpInputRef = useRef(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTime > 0) {
      interval = setInterval(() => {
        setResendTime(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTime]);

  useEffect(() => {
    // Show toast message if there's an API error
    if (apiError) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: apiError,
      });
    }
  }, [apiError]);
  useEffect(() => {
    if (successMessage) {
      Toast.show({
        type: 'success',
        text1: 'Verification Successful',
        text2: successMessage,
      });
    }
  }, [successMessage]);

  const handleResend = () => {
    setResendTime(30);
    Alert.alert('New OTP Sent', 'Check your registered Email Address');
  };

  const handleSubmit = () => {
    if (value.length !== 6) {
      // Show toast message if OTP is invalid
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 6-digit OTP.',
      });
      return;
    }
    // Call the onPress function if OTP is valid
    onPress();
  };

  return (
    <ImageBackground
      source={require('../assets/Images/bgimg1.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        {/* Logo at the top */}
        <Image
          source={require('../assets/Images/dncrlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* OTP Model Container with Border */}
        <View style={styles.otpModelContainer}>
          <Text style={styles.heading}>Enter OTP</Text>
          <Text style={styles.subHeading}>
            We've sent a 6-digit code to your registered E-mail address
          </Text>

          <OtpInput
            ref={otpInputRef}
            numberOfDigits={6}
            onTextChange={onChangeText} // Use the onChangeText prop
            onFilled={onChangeText} // Use the onChangeText prop
            theme={{
              pinCodeContainerStyle: styles.otpBox,
              focusedPinCodeContainerStyle: styles.activeOtpBox,
            }}
            focusColor="#4a90e2"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (value.length !== 6 || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmit} // Use the handleSubmit function
            disabled={value.length !== 6 || isLoading}>
            {isLoading ? (
              <Text style={styles.buttonText}>Verifying...</Text>
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive code?{' '}
              {resendTime > 0 ? (
                <Text style={styles.timerText}>Resend in {resendTime}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend Now</Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  otpModelContainer: {
    padding: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#cc0e74',
    width: '90%',
    marginHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
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
    borderColor: '#cc0e74',
    backgroundColor: '#e8f0fe',
  },
  submitButton: {
    backgroundColor: '#cc0e74',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
  },
  timerText: {
    color: '#ff4444',
  },
  resendLink: {
    color: '#cc0e74',
    fontWeight: 'bold',
    top: 4,
  },
});

export default OtpModel;
