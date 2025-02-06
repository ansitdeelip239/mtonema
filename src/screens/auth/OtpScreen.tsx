import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import {User} from '../../types';
import OtpModel from '../../components/OtpModel';
import CommonService from '../../services/CommonService';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpScreen'>;

const OtpScreen: React.FC<Props> = ({route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {storeToken, login, storeUser} = useAuth();
  const [OTP, setOtp] = useState('');
  const {email} = route.params;
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState(''); // State for API error message

  const handleSubmit = async () => {
    // Reset the API error state before each submission
    setApiError('');

    if (OTP.length !== 6) {
      setApiError('Please enter a 6-digit OTP.');
      return;
    }

    console.log('OTP Submitted:', OTP);
    console.log('Email', email);

    try {
      setIsLoading(true);
      let response;

      if (route.params.isForgetPassword) {
        response = await CommonService.ForgetPassword(email, OTP);
      }
      response = await AuthService.VerifyOTP(email, OTP);
      console.log('API Response:', response);

      if (response.Success) {
        const userResponse = await AuthService.verifyLoginInput(email);
        if (userResponse.Success) {
          storeUser(userResponse.data as User);
        }
        await storeToken(response.data);
        await login(response.data);
        setSuccessMessage('Your OTP has been verified successfully!');
      } else {
        if (response.Message === 'try after some time') {
          setApiError('Please enter a valid OTP.');
        } else {
          throw new Error(response.Message || 'OTP verification failed');
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', (error as Error).message);
      setApiError(
        (error as Error).message ||
          'An error occurred during OTP verification.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OtpModel
      value={OTP}
      onChangeText={setOtp}
      onPress={handleSubmit}
      isLoading={isLoading}
      apiError={apiError}
      successMessage={successMessage}
    />
  );
};

export default OtpScreen;
