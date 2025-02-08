import React, {useState, useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import OtpModel from '../../components/OtpModel';
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
      const response = await AuthService.OtpVerification(email, OTP);

      if (response.Success) {
        if (response.data) {
          const userResponse = await AuthService.GetUserByToken(response.data);
          await storeUser(userResponse.data);
        }

        await storeToken(response.data as string);
        await login(response.data as string);

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
  }, [OTP, showError, email, storeToken, login, hideDialog, storeUser]);

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
