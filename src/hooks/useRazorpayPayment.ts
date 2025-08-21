import {useState, useCallback} from 'react';
import {openRazorpayModal} from '../utils/razorpay';
import {usePaymentVerification} from './usePaymentVerification';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

interface UseRazorpayPaymentOptions {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
  successMessage?: {
    title: string;
    subtitle: string;
  };
  errorMessage?: {
    title: string;
    subtitle: string;
  };
}

export const useRazorpayPayment = (options?: UseRazorpayPaymentOptions) => {
  const [isPaying, setIsPaying] = useState(false);

  const {isVerifying, verifyPayment} = usePaymentVerification({
    onSuccess: options?.onPaymentSuccess,
    successMessage: options?.successMessage,
    errorMessage: options?.errorMessage,
  });

  const processPayment = useCallback(
    async (razorpayOptions: RazorpayOptions) => {
      setIsPaying(true);

      try {
        await new Promise<void>((resolve, reject) => {
          openRazorpayModal(
            razorpayOptions,
            async success => {
              console.log('Payment Success:', success);
              setIsPaying(false);

              // Verify payment
              const verified = await verifyPayment();
              if (verified) {
                resolve();
              } else {
                reject(new Error('Payment verification failed'));
              }
            },
            error => {
              setIsPaying(false);
              console.error('Razorpay error:', error);
              options?.onPaymentError?.(error);
              reject(error);
            },
          );
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
      }
    },
    [verifyPayment, options],
  );

  return {
    isPaying,
    isVerifying,
    processPayment,
    isProcessing: isPaying || isVerifying,
  };
};
