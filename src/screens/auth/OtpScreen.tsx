import React, {useState, useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import {User} from '../../types';
import OtpModel from '../../components/OtpModel';
import CommonService from '../../services/CommonService';
import {useDialog} from '../../hooks/useDialog';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpScreen'>;

const OtpScreen: React.FC<Props> = ({route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {storeToken, login, storeUser} = useAuth();
  const [OTP, setOtp] = useState('');
  const {email} = route.params;
  const {showError, hideDialog} = useDialog();

  const handleSubmit = useCallback(async () => {
    if (OTP.length !== 6) {
      showError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      let response;

      // Ensure verification method is specified
      if (route.params.isForgetPassword) {
        response = await CommonService.ForgetPassword(email, OTP);
      } else {
        // Add your default verification method here
        response = await CommonService.ForgetPassword(email, OTP);
      }

      if (response.Success) {
        const userResponse = await AuthService.verifyLoginInput(email);
        if (userResponse.Success) {
          await storeUser(userResponse.data as User);
        }
        await storeToken(response.data);
        await login(response.data);

        hideDialog();
      } else {
        const errorMessage =
          response.Message === 'Invalid Otp'
            ? 'Please enter a valid OTP.'
            : response.Message || 'OTP verification failed';

        showError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        'An error occurred during OTP verification.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [OTP, showError, route.params.isForgetPassword, email, storeToken, login, hideDialog, storeUser]);

  return (
    <OtpModel
      value={OTP}
      onChangeText={setOtp}
      onPress={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default OtpScreen;
