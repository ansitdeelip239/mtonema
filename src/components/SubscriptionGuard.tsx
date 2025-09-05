import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';
import {useSubscription} from '../context/SubscriptionProvider';
import PaymentScreen from '../screens/partner/PaymentScreen/PaymentScreen';
import BillingScreen from '../screens/partner/BillingScreen/BillingScreen';
import Images from '../constants/Images';
import config from '../config';
import Roles from '../constants/Roles';
import TeamSubscriptionScreen from '../screens/partner/TeamSubscriptionScreen/TeamSubscriptionScreen';
import { useAuth } from '../context/AuthProvider';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

// Extract LoadingScreen component
const LoadingScreen = React.memo(
  ({progressAnim}: {progressAnim: Animated.Value}) => {
    const progressWidth = useMemo(
      () =>
        progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        }),
      [progressAnim],
    );

    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.MTESTATES_LOGO} style={styles.logo} />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, {width: progressWidth}]}
            />
          </View>
        </View>
      </View>
    );
  },
);

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({children}) => {
  const {
    hasActiveSubscription,
    isLoadingSubscription,
    isPartnerOrTeam,
    refreshSubscription,
    subscriptionStatus,
  } = useSubscription();

  const {user} = useAuth();

  // Initialize Animated.Value only once
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize callback to prevent recreation
  const handlePaymentSuccess = useCallback(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  // Combine and optimize useEffect hooks
  useEffect(() => {
    // Handle initial load state
    if (isPartnerOrTeam) {
      if (!isLoadingSubscription && isInitialLoad) {
        setIsInitialLoad(false);
      }
    } else {
      setIsInitialLoad(false);
    }

    // Handle animation
    if (isInitialLoad || isLoadingSubscription) {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    } else if (!isInitialLoad && !isLoadingSubscription) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isLoadingSubscription, isPartnerOrTeam, isInitialLoad, progressAnim]);

  // Early return for non-partner users
  if (!isPartnerOrTeam) {
    return <>{children}</>;
  }

  // Show loading screen
  if (isInitialLoad || isLoadingSubscription) {
    return <LoadingScreen progressAnim={progressAnim} />;
  }

  // Bypass subscription logic for specific emails from config
  if (user?.email && config.bypass_emails.includes(user.email)) {
    return <>{children}</>;
  }

  // Handle subscription logic
  if (!hasActiveSubscription) {
    // If user is a team member, show team member subscription screen
    if (user?.role === Roles.TEAM) {
      return (
        <TeamSubscriptionScreen
          onCheckStatus={refreshSubscription}
        />
      );
    }
    const hasChosenPlan = subscriptionStatus?.chosenPlan?.planId;
    return hasChosenPlan ? (
      <BillingScreen onPaymentSuccess={handlePaymentSuccess} />
    ) : (
      <PaymentScreen onPaymentSuccess={handlePaymentSuccess} />
    );
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    maxWidth: 200,
    maxHeight: 120,
    resizeMode: 'contain',
  },
  progressContainer: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#53a20e',
    borderRadius: 2,
  },
});

export default React.memo(SubscriptionGuard);
