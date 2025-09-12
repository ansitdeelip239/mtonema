import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';
import OtpModel from '../../components/OtpModel';
import {useLogoStorage} from '../../hooks/useLogoStorage';
import MasterService from '../../services/MasterService';
import {useTheme} from '../../context/ThemeProvider';
import HeaderComponent from './components/HeaderComponent';
import Roles from '../../constants/Roles';
import Colors from '../../constants/Colors';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthProvider';
import { useDialog } from '../../context/DialogProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpScreen'>;

const OtpScreen: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const {storeToken, login, storeUser, storePartnerZone} = useAuth();
  const [OTP, setOtp] = useState('');
  const {email, logoUrl, location} = route.params;
  const {showError, hideDialog} = useDialog();
  const {updateTheme} = useTheme();
  const {t} = useTranslation();

  // Partner info state
  const [partnerInfo, setPartnerInfo] = useState<{
    imageUrl?: string;
    name?: string;
    domain?: string;
    colorScheme?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
  }>({});

  // Parse the location description JSON on component mount
  useEffect(() => {
    try {
      if (location && location.description) {
        const parsedDescription = JSON.parse(location.description);
        setPartnerInfo(parsedDescription);
      }
    } catch (error) {
      console.error('Failed to parse location description:', error);
    }
  }, [location]);

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
          // Existing authentication logic
          const userResponse = await AuthService.getUserByToken(response.data);
          await storeUser(userResponse.data);

          // Check if user is ADMIN - if so, use default theme
          if (userResponse.data.role === Roles.ADMIN) {
            const defaultTheme = {
              primaryColor: Colors.MT_PRIMARY_1,
              secondaryColor: Colors.MT_PRIMARY_2,
              backgroundColor: Colors.MT_SECONDARY_3,
              textColor: Colors.MT_SECONDARY_1,
            };
            await updateTheme(defaultTheme);
          } else if (
            (userResponse.data.role === Roles.PARTNER ||
              userResponse.data.role === Roles.TEAM) &&
            userResponse.data.partnerLocation
          ) {
            const masterResponse = await MasterService.getMasterDetailsById(
              userResponse.data.partnerLocation,
            );

            await storePartnerZone(masterResponse.data);

            if (masterResponse.success) {
              const description = JSON.parse(masterResponse.data.description);
              const theme = {
                primaryColor: description.colorScheme.primaryColor,
                secondaryColor: description.colorScheme.secondaryColor,
                backgroundColor: description.colorScheme.backgroundColor,
                textColor: description.colorScheme.textColor,
              };
              await updateTheme(theme);
            }
          }

          // Store the logo URL if we have it from route params
          if (logoUrl) {
            await storeLogoData({
              imageUrl: logoUrl,
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
    updateTheme,
    storePartnerZone,
  ]);

  const handleResendOtp = useCallback(async () => {
    try {
      setIsResendingOtp(true);

      const response = await AuthService.otpVerification(
        email,
        undefined,
        location && location.description
          ? JSON.parse(location.description).domain
          : undefined,
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: t('auth.otp.resendSuccess', 'OTP sent successfully'),
          visibilityTime: 3000,
        });
      } else {
        showError(
          response.message || t('auth.otp.resendError', 'Failed to resend OTP'),
        );
      }
    } catch (error) {
      showError(t('auth.otp.resendError', 'Failed to resend OTP'));
    } finally {
      setIsResendingOtp(false);
    }
  }, [email, location, showError, t]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <HeaderComponent
          title={t('auth.otp.title')}
          onBackPress={navigation.goBack}
        />
      )}

      <OtpModel
        value={OTP}
        onChangeText={setOtp}
        onPress={handleSubmit}
        isLoading={isLoading}
        themeColor={partnerInfo.colorScheme?.primaryColor}
        onResendOtp={handleResendOtp}
        isResendingOtp={isResendingOtp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default OtpScreen;
