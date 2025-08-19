import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';
import {useSubscription} from '../context/SubscriptionProvider';
import PaymentScreen from '../screens/partner/PaymentScreen/PaymentScreen';
import Images from '../constants/Images';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({children}) => {
  const {
    hasActiveSubscription,
    isLoadingSubscription,
    isPartnerOrTeam,
    refreshSubscription,
  } = useSubscription();

  const [progressAnim] = useState(new Animated.Value(0));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handlePaymentSuccess = () => {
    refreshSubscription();
  };

  // Handle initial load state to prevent flash
  useEffect(() => {
    if (isPartnerOrTeam) {
      // For partner/team users, wait for the first subscription check to complete
      if (!isLoadingSubscription && isInitialLoad) {
        setIsInitialLoad(false);
      }
    } else {
      // For non-partner users, immediately set initial load to false
      setIsInitialLoad(false);
    }
  }, [isLoadingSubscription, isPartnerOrTeam, isInitialLoad]);

  useEffect(() => {
    if (isInitialLoad || isLoadingSubscription) {
      // Reset progress and start single-run animation
      progressAnim.setValue(0);

      // Animate to 90% over 3 seconds, then pause
      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    } else if (!isInitialLoad && !isLoadingSubscription) {
      // Complete the progress bar when loading finishes
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isInitialLoad, isLoadingSubscription, progressAnim]);

  if (!isPartnerOrTeam) {
    return <>{children}</>;
  }

  // Show loading screen during initial load or when actively loading subscription
  if (isInitialLoad || isLoadingSubscription) {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.MTESTATES_LOGO} style={styles.logo} />
        </View>
        <View style={styles.progressContainer}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, {width: progressWidth}]}
            />
          </View>
        </View>
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

export default SubscriptionGuard;
