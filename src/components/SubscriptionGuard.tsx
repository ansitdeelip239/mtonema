import React, {useState, useEffect, useCallback} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import PartnerService from '../services/PartnerService';
import {useAuth} from '../hooks/useAuth';
import PaymentScreen from '../screens/partner/PaymentScreen/PaymentScreen';
import Roles from '../constants/Roles';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const {user} = useAuth();

  const isPartnerOrTeam =
    user?.role === Roles.PARTNER || user?.role === Roles.TEAM;

  const checkSubscriptionStatus = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await PartnerService.getSubscriptionStatus(user.id);

      if (response.success) {
        const data = response.data;
        setHasActiveSubscription(data.hasActiveAccess);
      } else {
        setHasActiveSubscription(false);
      }
    } catch (error) {
      setHasActiveSubscription(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isPartnerOrTeam) {
      checkSubscriptionStatus();
    } else {
      setIsLoading(false);
    }
  }, [checkSubscriptionStatus, isPartnerOrTeam]);

  const handlePaymentSuccess = () => {
    checkSubscriptionStatus();
  };

  if (!isPartnerOrTeam) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#53a20e" />
      </View>
    );
  }

  if (!hasActiveSubscription) {
    return <PaymentScreen onPaymentSuccess={handlePaymentSuccess} />;
  }

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
