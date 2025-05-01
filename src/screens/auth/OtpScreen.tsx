import React, {useState, useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import {useAuth} from '../../hooks/useAuth';
import OtpModel from '../../components/OtpModel';
import {useDialog} from '../../hooks/useDialog';
import {useLogoStorage} from '../../hooks/useLogoStorage';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpScreen'>;

const OtpScreen: React.FC<Props> = ({route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {storeToken, login, storeUser} = useAuth();
  const [OTP, setOtp] = useState('');
  const {email, logoUrl} = route.params;
  const {showError, hideDialog} = useDialog();

  // Use the enhanced hook
  const {storeLogoData, extractLogoFromPartnerLocation} = useLogoStorage();

  const handleSubmit = useCallback(async () => {
    if (OTP.length !== 6) {
      showError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.otpVerification(email, OTP);

      if (response.success) {
        if (response.data) {
          const userResponse = await AuthService.getUserByToken(response.data);
          await storeUser(userResponse.data);

          // Store the logo URL if we have it from route params
          if (logoUrl) {
            await storeLogoData({
              imageUrl: logoUrl,
              // You can provide other data if available
            });
          }

          // If user has a partner location, extract and store its logo
          if (userResponse.data && userResponse.data.partnerLocation) {
            await extractLogoFromPartnerLocation(
              userResponse.data.partnerLocation,
            );
          }
        }

        await storeToken(response.data as string);
        await login(response.data as string);

        hideDialog();
      } else {
        const errorMessage =
          response.message === 'Invalid Otp'
            ? 'Please enter a valid OTP.'
            : response.message || 'OTP verification failed';

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
  }, [
    OTP,
    showError,
    email,
    storeToken,
    login,
    hideDialog,
    storeUser,
    logoUrl,
    storeLogoData,
    extractLogoFromPartnerLocation,
  ]);

  return (
    <OtpModel
      value={OTP}
      onChangeText={setOtp}
      onPress={handleSubmit}
      isLoading={isLoading}
      logoUrl={logoUrl}
    />
  );
};

export default OtpScreen;
