import RazorpayCheckout from 'react-native-razorpay';
import Images from '../constants/Images';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
}

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayErrorResponse = {
  code: number;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: any;
};

const RAZORPAY_NAME = 'MT One';
const RAZORPAY_IMAGE = Images.MT_ONE_LOGO;

export const openRazorpayModal = (
  options: RazorpayOptions,
  onSuccess: (response: RazorpaySuccessResponse) => void,
  onError: (error: RazorpayErrorResponse) => void,
) => {
  const finalOptions = {
    ...options,
    name: RAZORPAY_NAME,
    image: RAZORPAY_IMAGE,
  };
  RazorpayCheckout.open(finalOptions)
    .then(onSuccess)
    .catch(onError);
};
