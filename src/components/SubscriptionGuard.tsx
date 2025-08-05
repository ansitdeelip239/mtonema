import React, {useState, useEffect, useCallback} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import PartnerService from '../services/PartnerService';
import {useAuth} from '../hooks/useAuth';
import PaymentScreen from '../screens/partner/PaymentScreen/PaymentScreen';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const {user} = useAuth();

  const checkSubscriptionStatus = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await PartnerService.getSubscriptionStatus(user.id);

      console.log(response.data);

      if (response.success) {
        const data = response.data;

        // Check if user has active access
        setHasActiveSubscription(data.hasActiveAccess);
      } else {
        console.error('Failed to fetch subscription status');
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // In case of error, assume no active subscription to be safe
      setHasActiveSubscription(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  // Refresh subscription status after successful payment
  const handlePaymentSuccess = () => {
    checkSubscriptionStatus();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#53a20e" />
      </View>
    );
  }

  // If user doesn't have active subscription, show payment screen
  if (!hasActiveSubscription) {
    return <PaymentScreen onPaymentSuccess={handlePaymentSuccess} />;
  }

  // If user has active subscription, show the protected content
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default SubscriptionGuard;
