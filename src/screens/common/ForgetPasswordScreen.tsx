import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Colors from '../../constants/Colors';
import CommonService from '../../services/CommonService';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import { useDialog } from '../../hooks/useDialog';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgetPassword'>;

const ForgetPasswordScreen:React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [_isLoading, setIsLoading] = useState(false);
const {showError} = useDialog();
  const handleContinue = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await CommonService.ForgetPassword(email);
       console.log('otp repsonse',response);
      if (response.data === null && response.Success === true) {
        navigation.navigate('OtpScreen', { email });
      } else {
        showError('Failed to send OTP. Please try again');
      }
    } catch (error) {
      showError('An error occurred while sending OTP.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <ImageBackground
      source={require('../../assets/Images/bgimg1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address, and we will send you a password reset link.
        </Text>

        <TextInput
          label="Enter your email address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity onPress={handleContinue} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Toast Message Container */}
        <Toast />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 50,
    color: 'black',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.main,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ForgetPasswordScreen;
