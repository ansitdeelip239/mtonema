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
    isCreatingOrder,
    isPaying,
    isVerifying,
    onPayment,
    formatPrice,
  }: {
    selectedPlan: Plan;
    userName: string;
    isProcessing: boolean;
    isCreatingOrder: boolean;
    isPaying: boolean;
    isVerifying: boolean;
    onPayment: () => void;
    formatPrice: (price: number) => string;
  }) => {
    // Get loading state details
    const getLoadingState = () => {
      if (isCreatingOrder) {
        return {
          message: 'Creating Order...',
          color: '#f59e0b', // Amber
        };
      }
      if (isPaying) {
        return {
          message: 'Processing...',
          color: '#6366f1', // Blue
        };
      }
      if (isVerifying) {
        return {
          message: 'Verifying...',
          color: '#10b981', // Green
        };
      }
      return null;
    };

    const loadingState = getLoadingState();

    return (
      <View style={styles.paymentSection}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Subscription for:</Text>
          <Text style={styles.paymentUserName}>{userName}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            isProcessing && styles.payButtonDisabled,
            loadingState && {backgroundColor: loadingState.color},
          ]}
          onPress={onPayment}
          disabled={isProcessing}
          activeOpacity={0.8}>
          {isProcessing ? (
            <View style={styles.payButtonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.payButtonText, styles.payButtonTextMargin]}>
                {loadingState?.message || 'Processing...'}
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
    );
  },
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
    // Don't override background color here since we set it dynamically
    opacity: 0.8,
  },
  payButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButtonTextMargin: {
    marginTop: 0, // Remove margin when in loading state
  },
  payButtonSubtext: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
});
