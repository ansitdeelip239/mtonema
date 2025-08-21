import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {verifyPaymentStatus} from '../utils/payment';
import {useSubscription} from '../context/SubscriptionProvider';
import {useAuth} from './useAuth';

interface UsePaymentVerificationOptions {
  onSuccess?: () => void;
  successMessage?: {
    title: string;
    subtitle: string;
  };
  errorMessage?: {
    title: string;
    subtitle: string;
  };
}

export const usePaymentVerification = (
  options?: UsePaymentVerificationOptions,
) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const {checkSubscriptionStatus} = useSubscription();
  const {user} = useAuth();

  const defaultSuccessMessage = {
    title: 'Payment Success',
    subtitle: 'Your subscription has been activated successfully!',
  };

  const defaultErrorMessage = {
    title: 'Payment Verification Failed',
    subtitle:
      'Payment was processed but verification failed. Please contact support if your subscription is not activated.',
  };

  const verifyPayment = useCallback(async () => {
    if (!user?.id) {
      console.error('User ID not available for verification');
      return false;
    }

    setIsVerifying(true);

    try {
      const isVerified = await verifyPaymentStatus(
        checkSubscriptionStatus,
        user.id,
      );

      if (isVerified) {
        // Show success message
        Toast.show({
          type: 'success',
          text1: options?.successMessage?.title || defaultSuccessMessage.title,
          text2:
            options?.successMessage?.subtitle || defaultSuccessMessage.subtitle,
        });

        // Call success callback
        options?.onSuccess?.();
        return true;
      } else {
        // Show error messages
        const errorMsg =
          options?.errorMessage?.subtitle || defaultErrorMessage.subtitle;

        Alert.alert(
          options?.errorMessage?.title || defaultErrorMessage.title,
          errorMsg,
        );

        Toast.show({
          type: 'error',
          text1: options?.errorMessage?.title || defaultErrorMessage.title,
          text2: errorMsg,
        });
        return false;
      }
    } catch (error) {
      console.error('Payment verification error:', error);

      const errorMsg =
        'An error occurred during verification. Please try again.';
      Alert.alert('Verification Error', errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: errorMsg,
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [
    user?.id,
    checkSubscriptionStatus,
    options,
    defaultErrorMessage.title,
    defaultErrorMessage.subtitle,
    defaultSuccessMessage.title,
    defaultSuccessMessage.subtitle,
  ]);

  return {
    isVerifying,
    verifyPayment,
  };
};
