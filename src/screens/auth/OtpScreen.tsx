import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';
import { ActivityIndicator } from 'react-native-paper';
import { User } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpScreen'>;

const OtpScreen: React.FC<Props> = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { storeToken, login, storeUser } = useAuth();
  const [OTP, setOtp] = useState('');
  const { email } = route.params;
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State for custom alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message

  // Function to show the custom alert
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  // Function to hide the custom alert
  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  const handleSubmit = async () => {
    if (OTP.length !== 6) {
      showAlert('Please enter a 6-digit OTP.');
      return;
    }

    console.log('OTP Submitted:', OTP);
    console.log('Email', email);

    try {
      setIsLoading(true);
      const response = await AuthService.VerifyOTP(email, OTP);
      console.log('API Response:', response);

      if (response.Success) {
        const userResponse = await AuthService.verifyLoginInput(email);
        if (userResponse.Success) {
          storeUser(userResponse.data as User);
        }
        await storeToken(response.data);
        await login(response.data);
      } else {
        if (response.Message === 'try after some time') {
          showAlert('Please enter a valid OTP.');
        } else {
          throw new Error(response.Message || 'OTP verification failed');
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', (error as Error).message);
      showAlert((error as Error).message || 'An error occurred during OTP verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>Please enter the OTP sent to your Email</Text>

          <TextInput
  style={styles.otpInput}
  placeholder="Enter OTP"
  placeholderTextColor="#999"
  keyboardType="numeric"
  maxLength={6}
  value={OTP}
  onChangeText={setOtp}
/>

          <TouchableOpacity
            style={[styles.submitButton]}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Alert Modal */}
      <Modal
        visible={isAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideAlert}>
        <View style={styles.modalContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Invalid OTP</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={hideAlert}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
otpInput: {
  width: '100%',
  height: 50,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 20,
  fontSize: 18,
  color: '#333',
  backgroundColor: '#fff',
  textAlign: 'left', // Remove textAlign: 'center'
  paddingLeft: 20, // Add padding to visually center the text
},
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#cc0e74',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Custom Alert Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff', // Pink background
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  alertButton: {
    backgroundColor: '#FF1493', // Darker pink for the button
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  alertButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OtpScreen;
