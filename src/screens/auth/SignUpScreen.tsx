import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import SignupForm from '../../components/SignupForm';
import {SignUpRequest} from '../../types';
import AuthService from '../../services/AuthService';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const {role} = route.params;
  const [loading, setLoading] = useState(false);

  const handleSignup = async (formData: SignUpRequest, isSeller: boolean) => {
    try {
      setLoading(true);
      const response = isSeller
        ? await AuthService.RegisterSeller(formData)
        : await AuthService.signUp(formData);
      console.log('API Response:', response);

      if (response.Success && response.Message !== 'Email already exists') {
        navigation.navigate('OtpScreen', {email: formData.Email});
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.Message || 'Sign up failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupForm
      handleSignup={(formData: SignUpRequest) =>
        handleSignup(formData, role !== 'User')
      }
      loading={loading}
    />
  );
};

export default SignUpScreen;
