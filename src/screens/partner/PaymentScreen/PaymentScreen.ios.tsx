import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSubscription} from '../../../context/SubscriptionProvider';
import GetIcon from '../../../components/GetIcon';
import {LoadingComponent} from './components/LoadingComponent';
import { useAuth } from '../../../context/AuthProvider';

interface PaymentScreenProps {
  onPaymentSuccess?: () => void;
  isUpgrade?: boolean;
  onClose?: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onPaymentSuccess: _onPaymentSuccess,
  isUpgrade: _isUpgrade,
  onClose: _onClose,
}) => {
  const {logout} = useAuth();
  const {isLoadingPlans, fetchPlans} = useSubscription();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Automatically show access restricted alert and log out user when they access this screen on iOS
  useEffect(() => {
    Alert.alert(
      'Access Restricted',
      'Your account is not authorized for access. Please contact the administrator for assistance.',
      [
        {
          text: 'OK',
          onPress: logout,
        },
      ]
    );
  }, [logout]);

  if (isLoadingPlans) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.restrictedContainer}>
        <GetIcon iconName="about" size={48} color="#666" />
        <Text style={styles.restrictedTitle}>Access Restricted</Text>
        <Text style={styles.restrictedMessage}>
          Your account is not authorized for access. Please contact the administrator for assistance.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  restrictedMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default React.memo(PaymentScreen);
