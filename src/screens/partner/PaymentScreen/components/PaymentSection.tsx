import React from 'react';
import {Plan} from '../../../../types/payment';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const PaymentSection = React.memo(
  ({
    selectedPlan,
    userName,
    isProcessing,
    isPaying,
    onPayment,
    formatPrice,
  }: {
    selectedPlan: Plan;
    userName: string;
    isProcessing: boolean;
    isPaying: boolean;
    onPayment: () => void;
    formatPrice: (price: number) => string;
  }) => (
    <View style={styles.paymentSection}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentLabel}>Subscription for:</Text>
        <Text style={styles.paymentUserName}>{userName}</Text>
      </View>
      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={onPayment}
        disabled={isProcessing}
        activeOpacity={0.8}>
        {isProcessing ? (
          <View style={styles.payButtonContent}>
            <ActivityIndicator color="white" size="small" />
            <Text style={[styles.payButtonText, styles.payButtonTextMargin]}>
              {isPaying ? 'Processing...' : 'Verifying...'}
            </Text>
          </View>
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
  ),
);

const styles = StyleSheet.create({
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
  payButtonTextMargin: {
    marginTop: 4,
  },
  payButtonSubtext: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
});
