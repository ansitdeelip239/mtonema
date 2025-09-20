import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import GetIcon from '../../../components/GetIcon';
import { useAuth } from '../../../context/AuthProvider';

type Props = {
  onPaymentSuccess?: () => void;
};

const BillingScreen: React.FC<Props> = ({onPaymentSuccess: _onPaymentSuccess}) => {
  const {logout} = useAuth();

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
    backgroundColor: '#f8fafc',
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

export default React.memo(BillingScreen);