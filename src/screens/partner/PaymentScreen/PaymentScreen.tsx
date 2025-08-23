import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../../hooks/useAuth';
import {useSubscription} from '../../../context/SubscriptionProvider';
import GetIcon from '../../../components/GetIcon';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import {useRazorpayPayment} from '../../../hooks/useRazorpayPayment';
import {LoadingComponent} from './components/LoadingComponent';
import {SubscriptionMessage} from './components/SubscriptionMessage';
import {PlanCard} from './components/PlanCard';
import {PaymentSection} from './components/PaymentSection';
import {NoPlansComponent} from './components/NoPlansComponent';
import {Plan} from '../../../types/payment';

interface PaymentScreenProps {
  onPaymentSuccess?: () => void;
  isUpgrade?: boolean;
  onClose?: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onPaymentSuccess,
  isUpgrade = false,
  onClose,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  // Add state for createPaymentOrder API loading
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const {user} = useAuth();
  const {
    plans,
    isLoadingPlans,
    fetchPlans,
    createPaymentOrder,
    subscriptionStatus,
    isInTrial,
  } = useSubscription();

  // Use the custom payment hook
  const {isPaying, isVerifying, processPayment} = useRazorpayPayment({
    onPaymentSuccess,
    successMessage: {
      title: 'Payment Success',
      subtitle: 'Your subscription has been activated!',
    },
  });

  // Calculate total processing state
  const isProcessing = isCreatingOrder || isPaying || isVerifying;

  // Memoize expensive functions
  const formatPrice = useCallback((price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  }, []);

  const subscriptionMessage = useMemo(() => {
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

      if (!hasActiveAccess) {
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

        if (trialDaysLeft === 0 && orderDaysLeft === 0) {
          return {
            show: true,
            title: 'Subscription Required',
            message:
              'Your subscription has expired. Please choose a plan to continue using the app.',
          };
        }

        if (orderDaysLeft > 0 && orderDaysLeft <= 7) {
          return {
            show: true,
            title: 'Subscription Renewal Required',
            message:
              'Your subscription is about to expire. Please renew your plan to continue uninterrupted access.',
          };
        }
      }

      if (hasActiveAccess) {
        return {
          show: true,
          title: 'Manage Subscription',
          message:
            'You have an active subscription. Choose a plan to upgrade or extend.',
        };
      }
    }

    return {
      show: true,
      title: 'Subscription Required',
      message: 'Please choose a plan to start using the app.',
    };
  }, [isUpgrade, isInTrial, subscriptionStatus]);

  const handlePayment = useCallback(async () => {
    if (!user?.id || !selectedPlan) {
      Alert.alert(
        'Error',
        !user?.id
          ? 'User not found. Please login again.'
          : 'Please select a plan first.',
      );
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Step 1: Create payment order (show loading in button)
      const orderData = await createPaymentOrder({
        userId: user.id,
        planId: selectedPlan.id,
        customerId: '',
      });

      if (!orderData) {
        Alert.alert(
          'Error',
          'Failed to create payment order. Please try again.',
        );
        return;
      }

      // Step 2: Process Razorpay payment (hook will handle its own loading states)
      await processPayment({
        description: `${orderData.planName} - ${orderData.billingCycle}`,
        currency: 'INR',
        key: orderData.keyId,
        amount: orderData.amount,
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: user.email as string,
          contact: user.phone as string,
          name: user.name as string,
        },
        theme: {color: '#53a20e'},
      });
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  }, [user, selectedPlan, createPaymentOrder, processPayment]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (isLoadingPlans) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      {/* Header */}
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
        <SubscriptionMessage message={subscriptionMessage.message} />
      )}

      {plans.length === 0 ? (
        <NoPlansComponent />
      ) : (
        plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan?.id === plan.id}
            onSelect={setSelectedPlan}
            formatPrice={formatPrice}
          />
        ))
      )}

      {selectedPlan && (
        <PaymentSection
          selectedPlan={selectedPlan}
          userName={user?.name || 'User'}
          isProcessing={isProcessing}
          isCreatingOrder={isCreatingOrder}
          isPaying={isPaying}
          isVerifying={isVerifying}
          onPayment={handlePayment}
          formatPrice={formatPrice}
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
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

export default React.memo(PaymentScreen);
