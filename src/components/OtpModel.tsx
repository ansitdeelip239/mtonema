import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {useDialog} from '../hooks/useDialog';

interface OtpModelProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress: () => void;
  isLoading?: boolean;
}

const OtpModel: React.FC<OtpModelProps> = ({
  value,
  onChangeText,
  onPress,
  isLoading = false,
}) => {
  const otpInputRef = useRef(null);
  const {showError} = useDialog();

  const handleSubmit = () => {
    if (value.length !== 6) {
      showError('Please enter a valid 6-digit OTP.');
      return;
    }
    onPress();
  };

  return (
    <ImageBackground
      source={require('../assets/Images/bgimg1.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        <Image
          source={require('../assets/Images/dncrlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.otpModelContainer}>
          <Text style={styles.heading}>Enter OTP</Text>
          <Text style={styles.subHeading}>
            We've sent a 6-digit code to your registered E-mail address
          </Text>

          <OtpInput
            ref={otpInputRef}
            numberOfDigits={6}
            onTextChange={onChangeText}
            onFilled={onChangeText}
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
            onPress={handleSubmit}
            disabled={value.length !== 6 || isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
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
