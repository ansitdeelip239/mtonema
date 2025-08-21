import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import PartnerService from '../../../services/PartnerService';
import {NextBillResponse} from '../../../types/payment';
import PaymentModal from './components/PaymentModal';
import PaymentHistory from './components/PaymentHistory';
import {formatDate} from '../../../utils/dateUtils';
import {formatCurrency} from '../../../utils/currency';
import {openRazorpayModal} from '../../../utils/razorpay';
import {verifyPaymentStatus} from '../../../utils/payment';
import PaymentVerificationModal from '../../../components/PaymentVerificationModal';
import {useTheme} from '../../../context/ThemeProvider';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import {useSubscription} from '../../../context/SubscriptionProvider';
import {useAuth} from '../../../hooks/useAuth';
import Toast from 'react-native-toast-message';

type Props = {
  onPaymentSuccess?: () => void;
};

const BillingScreen: React.FC<Props> = ({onPaymentSuccess}) => {
  const [loading, setLoading] = useState(true);
  const [nextBill, setNextBill] = useState<NextBillResponse['nextBill'] | null>(
    null,
  );
  const [paymentHistory, setPaymentHistory] = useState<
    NextBillResponse['transactionHistory']
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const {theme} = useTheme();
  const {checkSubscriptionStatus} = useSubscription();
  const {user} = useAuth();

  useEffect(() => {
    const fetchNextBill = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await PartnerService.getNextBill();
        setNextBill(response.data.nextBill);
        setPaymentHistory(response.data.transactionHistory);
      } catch (err) {
        setError('Failed to load billing info.');
      } finally {
        setLoading(false);
      }
    };
    fetchNextBill();
  }, []);

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    setShowPaymentModal(false);
    if (!nextBill) {
      return;
    }
    setIsPaying(true);
    try {
      // Call payNextBill API
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

      openRazorpayModal(
        {
          key: keyId,
          amount: amount,
          currency: currency,
          description: description,
          order_id: razorpayOrderId,
          prefill: {
            email: partnerEmail,
            contact: nextBill.partner.phone,
            name: partnerName,
          },
          theme: {color: theme.primaryColor},
        },
        async _success => {
          setIsPaying(false);
          setIsVerifyingPayment(true);
          const isVerified = await verifyPaymentStatus(
            checkSubscriptionStatus,
            user?.id,
          );
          setIsVerifyingPayment(false);
            if (isVerified) {
            Toast.show({
              type: 'success',
              text1: 'Payment Success',
              text2: 'Your subscription has been activated successfully!',
            });
            onPaymentSuccess?.();
            } else {
            const message =
              'Payment was processed but verification failed. Please contact support if your subscription is not activated.';
            Alert.alert('Payment Verification Failed', message);
            Toast.show({
              type: 'error',
              text1: 'Payment Verification Failed',
              text2: message,
            });
            }
        },
        razorpayError => {
          setIsPaying(false);
          console.error('Razorpay error:', razorpayError);
        },
      );
    } catch (err) {
      setIsPaying(false);
      console.error('Failed to initiate payment:', err);

      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2:
          typeof err === 'object' && err !== null && 'description' in err
            ? (err as {description?: string}).description ||
              'Something went wrong'
            : 'Something went wrong',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading billing information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <GetIcon iconName="clear" size={48} color="#ef4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => console.log('Retry pressed')}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <SwitchAccountButton />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Billing & Payments</Text>
            <Text style={styles.subtitle}>
              Manage your subscription and payment history
            </Text>
          </View>
        </View>

        {/* Next Bill Card */}
        {nextBill && (
          <View style={styles.billCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <GetIcon iconName="phone" size={24} color="#6366f1" />
                <Text style={styles.cardTitle}>Next Bill</Text>
              </View>
              <View style={styles.amountBadge}>
                <Text style={styles.amountText}>
                  {formatCurrency(nextBill.amount)}
                </Text>
              </View>
            </View>

            <View style={styles.billDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Billing Cycle</Text>
                  <Text style={styles.detailValue}>
                    {nextBill.billingCycle}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {nextBill.durationDays} days
                  </Text>
                </View>
              </View>

              <View style={styles.periodInfo}>
                <Text style={styles.detailLabel}>Billing Period</Text>
                <Text style={styles.periodText}>
                  {formatDate(nextBill.startDate, 'dd MMM yyyy')} -{' '}
                  {formatDate(nextBill.endDate, 'dd MMM yyyy')}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <GetIcon iconName="phone" size={20} color="white" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment History */}
        <PaymentHistory paymentHistory={paymentHistory} />

        {/* Payment Modal */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          nextBill={nextBill}
        />
      </ScrollView>
      {/* Payment Loading Overlay */}
      {isPaying && (
        <View style={styles.paymentLoadingOverlay}>
          <View style={styles.paymentLoadingBox}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.paymentLoadingText}>Processing payment...</Text>
          </View>
        </View>
      )}
      {/* Payment Verification Modal */}
      <PaymentVerificationModal visible={isVerifyingPayment} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  billCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  amountBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  billDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  periodInfo: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  periodText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  paymentLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  paymentLoadingBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  paymentLoadingText: {
    marginTop: 18,
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default BillingScreen;
