import React, {useState, useEffect} from 'react';
import {openRazorpayModal} from '../../../utils/razorpay';
import {verifyPaymentStatus} from '../../../utils/payment';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import PaymentVerificationModal from '../../../components/PaymentVerificationModal';
import {useAuth} from '../../../hooks/useAuth';
import {useSubscription} from '../../../context/SubscriptionProvider';
import GetIcon from '../../../components/GetIcon';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import Toast from 'react-native-toast-message';

interface Plan {
  id: number;
  planName: string;
  description: string;
  price: number;
  billingCycle: string;
  durationDays: number;
  maxUsers: number;
  isTrial: boolean;
  razorpayItemId: string;
}

interface PaymentScreenProps {
  onPaymentSuccess?: () => void;
  isUpgrade?: boolean; // New prop to indicate if this is an upgrade from trial
  onClose?: () => void; // For when used in modal
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onPaymentSuccess,
  isUpgrade = false,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const {user} = useAuth();
  const {
    plans,
    isLoadingPlans,
    fetchPlans,
    createPaymentOrder,
    checkSubscriptionStatus,
    subscriptionStatus,
    isInTrial,
  } = useSubscription();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const getSubscriptionMessage = () => {
    // If this is an upgrade from trial, show a different message
    if (isUpgrade || isInTrial) {
      return {
        show: true,
        title: 'Upgrade to Premium',
        message:
          'Choose a plan to unlock all features and continue your journey with us.',
      };
    }

    if (subscriptionStatus) {
      const {trialStatus, hasActiveAccess, trialDaysLeft, orderDaysLeft} =
        subscriptionStatus;

      // If user doesn't have active access and trial has expired
      if (!hasActiveAccess) {
        // If they had a trial and it expired
        if (
          trialStatus?.trialStatus === 'Expired' ||
          trialStatus?.trialStatus === 'expired'
        ) {
          return {
            show: true,
            title: 'Trial Period Expired',
            message:
              'Your trial period has ended. Please choose a plan to continue using the app.',
          };
        }

        // If they have no trial days left or order days left
        if (trialDaysLeft === 0 && orderDaysLeft === 0) {
          return {
            show: true,
            title: 'Subscription Required',
            message:
              'Your subscription has expired. Please choose a plan to continue using the app.',
          };
        }

        // If subscription needs renewal (has some days left but less than a threshold)
        if (orderDaysLeft > 0 && orderDaysLeft <= 7) {
          return {
            show: true,
            title: 'Subscription Renewal Required',
            message:
              'Your subscription is about to expire. Please renew your plan to continue uninterrupted access.',
          };
        }
      }

      // If user has active access, they might not need to see this screen
      if (hasActiveAccess) {
        return {
          show: true,
          title: 'Manage Subscription',
          message:
            'You have an active subscription. Choose a plan to upgrade or extend.',
        };
      }
    }

    // Default message for users without any subscription
    return {
      show: true,
      title: 'Subscription Required',
      message: 'Please choose a plan to start using the app.',
    };
  };

  const handlePayment = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan first.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order first using context method
      const orderData = await createPaymentOrder({
        userId: user.id,
        planId: selectedPlan.id,
        customerId: '', // Empty for new customers
      });

      if (!orderData) {
        Alert.alert(
          'Error',
          'Failed to create payment order. Please try again.',
        );
        return;
      }

      // Prepare Razorpay options with dynamic data
      const options = {
        description: `${orderData.planName} - ${orderData.billingCycle}`,
        currency: 'INR',
        key: orderData.keyId,
        amount: orderData.amount,
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: user.email || 'ansitdeelip239@gmail.com',
          contact: user.phone || '7485898570',
          name: user.name || 'User',
        },
        theme: {color: '#53a20e'},
      };

      // Open Razorpay checkout using util
      openRazorpayModal(
        options,
        async _success => {
          // Handle success
          console.log('Payment Success:', _success);
          console.log('Order Data:', orderData);

          // Start payment verification
          setIsVerifyingPayment(true);
          const isVerified = await verifyPaymentStatus(
            checkSubscriptionStatus,
            user.id,
          );
          setIsVerifyingPayment(false);

            if (isVerified) {
            Toast.show({
              type: 'success',
              text1: 'Payment Success',
              text2: 'Your subscription has been activated!',
            });
            onPaymentSuccess?.();
            } else {
            const errorMsg =
              'Payment was processed but verification failed. Please contact support if your subscription is not activated.';
            Alert.alert('Payment Verification Failed', errorMsg);
            Toast.show({
              type: 'error',
              text1: 'Payment Verification Failed',
              text2: errorMsg,
            });
            }
        },
        error => {
          // Handle error or failure
          Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: error.description || 'Something went wrong',
          });
          console.log('Payment Error:', error);
        },
      );
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPlans) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#53a20e" />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  const subscriptionMessage = getSubscriptionMessage();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      {/* Header with user details and logout/close */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.accountLabel}>Payment for:</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
        </View>
        {isUpgrade && onClose ? (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <GetIcon iconName="back" size={18} color="#666" />
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        ) : (
          <SwitchAccountButton />
        )}
      </View>

      <Text style={styles.title}>
        {subscriptionMessage.title || 'Choose Your Plan'}
      </Text>

      {subscriptionMessage.show && (
        <View style={styles.subscriptionMessage}>
          <Text style={styles.messageText}>{subscriptionMessage.message}</Text>
        </View>
      )}

      {plans.length === 0 ? (
        <View style={styles.noPlansContainer}>
          <Text style={styles.noPlansText}>
            No plans available at the moment.
          </Text>
        </View>
      ) : (
        plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan(plan)}
            activeOpacity={0.8}>
            <View style={styles.planHeader}>
              <Text
                style={[
                  styles.planName,
                  selectedPlan?.id === plan.id && styles.selectedPlanText,
                ]}>
                {plan.planName}
              </Text>
              <View
                style={[
                  styles.selectionIndicator,
                  selectedPlan?.id === plan.id && styles.selectedIndicator,
                ]}
              />
            </View>

            <Text style={styles.planPrice}>
              {formatPrice(plan.price)}
              <Text style={styles.billingCycle}> / {plan.billingCycle}</Text>
            </Text>

            <Text style={styles.planDescription}>{plan.description}</Text>

            <View style={styles.planFeatures}>
              <Text style={styles.feature}>• Max Users: {plan.maxUsers}</Text>
              <Text style={styles.feature}>
                • Duration: {plan.durationDays} days
              </Text>
              {plan.isTrial && (
                <Text style={styles.trialBadge}>Trial Plan</Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}

      {selectedPlan && (
        <View style={styles.paymentSection}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Subscription for:</Text>
            <Text style={styles.paymentUserName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <View style={styles.payButtonContent}>
                <Text style={styles.payButtonText}>
                  Pay {formatPrice(selectedPlan.price)}
                </Text>
                <Text style={styles.payButtonSubtext}>
                  for {selectedPlan.planName}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Verification Modal */}
      <PaymentVerificationModal visible={isVerifyingPayment} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
    minWidth: 120,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subscriptionMessage: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  messageText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
  noPlansContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginTop: 50,
  },
  noPlansText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlanCard: {
    borderColor: '#53a20e',
    backgroundColor: '#f8fff8',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  selectedPlanText: {
    color: '#53a20e',
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  selectedIndicator: {
    borderColor: '#53a20e',
    backgroundColor: '#53a20e',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53a20e',
    marginBottom: 8,
  },
  billingCycle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  planFeatures: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  trialBadge: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: 'bold',
    marginTop: 5,
  },
  paymentSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentInfo: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#53a20e',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  payButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  payButtonContent: {
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButtonSubtext: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    minWidth: 80,
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default PaymentScreen;
