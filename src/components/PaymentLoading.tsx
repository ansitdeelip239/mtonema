import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import { useTranslation } from 'react-i18next';

interface PaymentLoadingOverlayProps {
  isCreatingOrder: boolean; // payNextBill API call
  isPaying: boolean; // Razorpay payment processing
  isVerifying: boolean; // Payment verification
}

export const PaymentLoadingOverlay = React.memo(
  ({isCreatingOrder, isPaying, isVerifying}: PaymentLoadingOverlayProps) => {
    const { t } = useTranslation();
    // Determine the loading message and color based on current state
    const getLoadingState = () => {
      if (isCreatingOrder) {
        return {
          message: t('billing.paymentLoading.creatingOrder', 'Creating payment order...'),
          color: '#f59e0b', // Amber for order creation
        };
      }
      if (isPaying) {
        return {
          message: t('billing.paymentLoading.processingPayment', 'Processing payment...'),
          color: '#6366f1', // Blue for payment processing
        };
      }
      if (isVerifying) {
        return {
          message: t('billing.paymentLoading.verifyingPayment', 'Verifying payment...'),
          color: '#10b981', // Green for verification
        };
      }
      return {
        message: t('billing.paymentLoading.loading', 'Loading...'),
        color: '#6366f1',
      };
    };

    const {message, color} = getLoadingState();

    return (
      <View style={styles.paymentLoadingOverlay}>
        <View style={styles.paymentLoadingBox}>
          <ActivityIndicator size="large" color={color} />
          <Text style={[styles.paymentLoadingText, {color}]}>{message}</Text>

          {/* Progress steps indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  (isCreatingOrder || isPaying || isVerifying) &&
                    styles.activeDot,
                  // eslint-disable-next-line react-native/no-inline-styles
                  isCreatingOrder && {backgroundColor: '#f59e0b'},
                ]}
              />
              <Text style={styles.stepLabel}>{t('billing.paymentLoading.steps.order', 'Order')}</Text>
            </View>

            <View style={styles.progressLine} />

            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  (isPaying || isVerifying) && styles.activeDot,
                  // eslint-disable-next-line react-native/no-inline-styles
                  isPaying && {backgroundColor: '#6366f1'},
                ]}
              />
              <Text style={styles.stepLabel}>{t('billing.paymentLoading.steps.payment', 'Payment')}</Text>
            </View>

            <View style={styles.progressLine} />

            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  isVerifying && styles.activeDot,
                  // eslint-disable-next-line react-native/no-inline-styles
                  isVerifying && {backgroundColor: '#10b981'},
                ]}
              />
              <Text style={styles.stepLabel}>{t('billing.paymentLoading.steps.verify', 'Verify')}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  paymentLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  paymentLoadingBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 250,
  },
  paymentLoadingText: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginBottom: 6,
  },
  activeDot: {
    backgroundColor: '#6366f1',
  },
  stepLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressLine: {
    height: 2,
    backgroundColor: '#e5e7eb',
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 18,
  },
});
