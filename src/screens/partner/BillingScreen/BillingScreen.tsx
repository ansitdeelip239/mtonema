import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {NextBillResponse} from '../../../types/payment';
import PaymentModal from './components/PaymentModal';
import PaymentHistory from './components/PaymentHistory';
import {useTheme} from '../../../context/ThemeProvider';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import Toast from 'react-native-toast-message';
import {useRazorpayPayment} from '../../../hooks/useRazorpayPayment';
import {LoadingComponent} from './components/LoadingComponent';
import {ErrorComponent} from './components/ErrorComponent';
import {PaymentLoadingOverlay} from '../../../components/PaymentLoading';
import {NextBillCard} from './components/NextBillCard';

type Props = {
  onPaymentSuccess?: () => void;
};

const BillingScreen: React.FC<Props> = ({onPaymentSuccess}) => {
  // Keep all states - they serve different purposes
  const [state, setState] = useState({
    loading: true,
    error: null as string | null,
    showPaymentModal: false,
    paying: false, // This is for payNextBill API call
  });

  const [nextBill, setNextBill] = useState<NextBillResponse['nextBill'] | null>(
    null,
  );
  const [paymentHistory, setPaymentHistory] = useState<
    NextBillResponse['transactionHistory']
  >([]);

  const {theme} = useTheme();

  // Hook manages Razorpay payment and verification
  const {isPaying, isVerifying, processPayment} = useRazorpayPayment({
    onPaymentSuccess,
    successMessage: {
      title: 'Payment Success',
      subtitle: 'Your subscription has been activated successfully!',
    },
  });

  const fetchNextBill = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));
    try {
      const response = await PartnerService.getNextBill();
      setNextBill(response.data.nextBill);
      setPaymentHistory(response.data.transactionHistory);
    } catch (err) {
      setState(prev => ({...prev, error: 'Failed to load billing info.'}));
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  }, []);

  const handlePayNow = useCallback(() => {
    setState(prev => ({...prev, showPaymentModal: true}));
  }, []);

  const showPaymentError = useCallback((message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Payment Failed',
      text2: message,
    });
  }, []);

  const handlePaymentConfirm = useCallback(async () => {
    if (!nextBill) {
      return;
    }

    setState(prev => ({...prev, showPaymentModal: false, paying: true}));

    try {
      // Step 1: Get order ID from payNextBill API
      const response = await PartnerService.payNextBill();
      const {
        razorpayOrderId,
        keyId,
        amount,
        currency,
        partnerName,
        partnerEmail,
        description,
      } = response.data;

      // Step 2: Process Razorpay payment (isPaying will be true here)
      await processPayment({
        key: keyId,
        amount,
        currency,
        description,
        order_id: razorpayOrderId,
        prefill: {
          email: partnerEmail,
          contact: nextBill.partner.phone,
          name: partnerName,
        },
        theme: {color: theme.primaryColor},
      });
    } catch (err) {
      console.error('Failed to initiate payment:', err);

      const errorMessage =
        typeof err === 'object' && err !== null && 'description' in err
          ? (err as {description?: string}).description ||
            'Something went wrong'
          : 'Something went wrong';

      showPaymentError(errorMessage);
    } finally {
      // Reset paying state after payNextBill API completes
      setState(prev => ({...prev, paying: false}));
    }
  }, [nextBill, theme.primaryColor, processPayment, showPaymentError]);

  useEffect(() => {
    fetchNextBill();
  }, [fetchNextBill]);

  // Calculate overall processing state
  const isProcessing = state.paying || isPaying || isVerifying;

  // Early returns for better performance
  if (state.loading) {
    return <LoadingComponent />;
  }
  if (state.error) {
    return <ErrorComponent error={state.error} onRetry={fetchNextBill} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <SwitchAccountButton />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Billing & Payments</Text>
            <Text style={styles.subtitle}>
              Manage your subscription and payment history
            </Text>
          </View>
        </View>

        {nextBill && (
          <NextBillCard nextBill={nextBill} onPayNow={handlePayNow} />
        )}

        <PaymentHistory paymentHistory={paymentHistory} />

        <PaymentModal
          visible={state.showPaymentModal}
          onClose={() => setState(prev => ({...prev, showPaymentModal: false}))}
          onConfirm={handlePaymentConfirm}
          nextBill={nextBill}
        />
      </ScrollView>

      {/* Single overlay that handles all three states */}
      {isProcessing && (
        <PaymentLoadingOverlay
          isCreatingOrder={state.paying}
          isPaying={isPaying}
          isVerifying={isVerifying}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    margin: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastHistoryItem: {
    borderBottomWidth: 0,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  successIndicator: {
    backgroundColor: '#10b981',
  },
  failureIndicator: {
    backgroundColor: '#ef4444',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  successStatus: {
    color: '#10b981',
  },
  failureStatus: {
    color: '#ef4444',
  },
  historyAmount: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
});

export default React.memo(BillingScreen);
