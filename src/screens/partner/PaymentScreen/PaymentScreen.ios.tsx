import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSubscription} from '../../../context/SubscriptionProvider';
import GetIcon from '../../../components/GetIcon';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import {LoadingComponent} from './components/LoadingComponent';
import {SubscriptionMessage} from './components/SubscriptionMessage';
import {PlanCard} from './components/PlanCard';
import {NoPlansComponent} from './components/NoPlansComponent';
import {Plan} from '../../../types/payment';
import { useAuth } from '../../../context/AuthProvider';

interface PaymentScreenProps {
  onPaymentSuccess?: () => void;
  isUpgrade?: boolean;
  onClose?: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onPaymentSuccess: _onPaymentSuccess,
  isUpgrade = false,
  onClose,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {user} = useAuth();
  const {
    plans,
    isLoadingPlans,
    fetchPlans,
    subscriptionStatus,
    isInTrial,
  } = useSubscription();

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

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

  const handleWebsitePayment = () => {
    Alert.alert(
      'Complete on Web Platform',
      'This subscription can be activated using our full-featured platform for complete account management.',
      [{text: 'OK'}],
    );
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (isLoadingPlans) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.accountLabel}>Account:</Text>
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
        <View style={styles.websitePaymentSection}>
          <View style={styles.selectedPlanInfo}>
            <Text style={styles.selectedPlanTitle}>Selected Plan</Text>
            <Text style={styles.selectedPlanName}>
              {selectedPlan.planName} - {selectedPlan.billingCycle}
            </Text>
            <Text style={styles.selectedPlanPrice}>
              {formatPrice(selectedPlan.price)}
            </Text>
          </View>

          <View style={styles.iosPaymentNotice}>
            <GetIcon iconName="about" size={24} color="#666" />
            <Text style={styles.iosPaymentTitle}>Web Platform Required</Text>
            <Text style={styles.iosPaymentText}>
              Full subscription management is available on our platform.
            </Text>
            <Text style={styles.iosPaymentText}>
              Access complete account features and subscription options.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.websitePaymentButton}
            onPress={handleWebsitePayment}
            activeOpacity={0.8}>
            <Text style={styles.websitePaymentButtonText}>
              Continue on Web
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  websitePaymentSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlanInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedPlanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#53a20e',
    marginBottom: 4,
  },
  selectedPlanPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iosPaymentNotice: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  iosPaymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  iosPaymentText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  websitePaymentButton: {
    backgroundColor: '#53a20e',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websitePaymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(PaymentScreen);
