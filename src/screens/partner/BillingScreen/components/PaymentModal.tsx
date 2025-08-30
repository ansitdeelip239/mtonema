import React, {useRef, useEffect} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
} from 'react-native';
import {NextBillResponse} from '../../../../types/payment';
import GetIcon from '../../../../components/GetIcon';
import {formatLocalizedDate} from '../../../../utils/dateUtils';
import {formatCurrency, formatLocalizedNumber} from '../../../../utils/currency';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import BillingCycle from '../../../../constants/BillingCycle';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nextBill: NextBillResponse['nextBill'] | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onConfirm,
  nextBill,
}) => {
  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current; // Start 300px below

  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  // Handle modal show/hide animations
  useEffect(() => {
    if (visible) {
      // Show animations
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animations
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, slideAnim]);

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // Remove default animation
      onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Animated Backdrop */}
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: backdropOpacity,
            },
          ]}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={handleBackdropPress}
            accessibilityLabel="Close modal"
          />
        </Animated.View>

        {/* Animated Modal Content */}
        <Animated.View
          style={[
            styles.paymentModal,
            {
              transform: [{translateY: slideAnim}],
            },
          ]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <GetIcon iconName="clear" size={20} color="#64748b" />
          </TouchableOpacity>

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalIconWrapper}>
              <GetIcon iconName="transaction" size={32} color="#6366f1" />
            </View>
            <Text style={styles.modalTitle}>{t('billing.paymentModal.title', 'Payment Details')}</Text>
            <Text style={styles.modalSubtitle}>
              {t('billing.paymentModal.subtitle', 'Review and confirm your payment details')}
            </Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {/* Payment Summary */}
            <View style={styles.paymentSummary}>
              <Text style={styles.summaryTitle}>{t('billing.paymentModal.paymentSummary', 'Payment Summary')}</Text>

              <View style={styles.summaryCard}>
                <View style={styles.amountSection}>
                  <Text style={styles.totalLabel}>{t('billing.paymentModal.totalAmount', 'Total Amount')}</Text>
                  <Text style={styles.totalAmount}>
                    {nextBill && formatCurrency(nextBill.amount, currentLanguage)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsSection}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('billing.nextBill.billingCycle', 'Billing Cycle')}</Text>
                    <Text style={styles.summaryValue}>
                      {nextBill?.billingCycle === BillingCycle.MONTHLY ? t('billing.nextBill.billingCycleValues.Monthly', 'Monthly') : t('billing.nextBill.billingCycleValues.Yearly', 'Yearly')}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('billing.nextBill.duration', 'Duration')}</Text>
                    <Text style={styles.summaryValue}>
                      {nextBill && formatLocalizedNumber(nextBill.durationDays, currentLanguage)} {t('billing.nextBill.days', 'days')}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('billing.paymentModal.servicePeriod', 'Service Period')}</Text>
                    <Text style={styles.summaryValue}>
                      {nextBill &&
                        `${formatLocalizedDate(
                          nextBill.startDate,
                          currentLanguage,
                        )} - ${formatLocalizedDate(
                          nextBill.endDate,
                          currentLanguage,
                        )}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('common.actions.cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <GetIcon iconName="rupee" size={16} color="white" />
              <Text style={styles.confirmButtonText}>{t('billing.paymentModal.confirmAndPay', 'Confirm & Pay')}</Text>
            </TouchableOpacity>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <GetIcon iconName="rupee" size={14} color="#059669" />
            <Text style={styles.securityText}>
              {t('billing.paymentModal.securityText', 'Secured with bank-level encryption')}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  paymentModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 34,
    maxHeight: '90%',
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  modalIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#dbeafe',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    flex: 1,
  },
  paymentSummary: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amountSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  detailsSection: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 6,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  securityText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default PaymentModal;
