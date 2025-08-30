import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../../../context/ThemeProvider';
import GetIcon from '../../../../components/GetIcon';
import PartnerService from '../../../../services/PartnerService';
import {Plan} from '../../../../types/payment';
import {convertPaiseToRupees, formatCurrency} from '../../../../utils/currency';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';

export interface BillingPlanSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlanId: number;
  onPlanSwitched: () => void;
}

// Modal Component
const BillingPlanSwitcherModal: React.FC<BillingPlanSwitcherModalProps> = ({
  visible,
  onClose,
  currentPlanId,
  onPlanSwitched,
}) => {
  const {theme} = useTheme();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(currentPlanId);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current; // Start 300px below

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

  // Fetch plans on open
  useEffect(() => {
    if (!visible) {
      return;
    }
    setLoading(true);
    setError(null);

    const fetchPlans = async () => {
      try {
        const response = await PartnerService.getPaymentPlans();
        if (response.success) {
          setPlans(response.data);
        }
      } catch (fetchErr) {
        setError(t('billing.errors.loadPlansFailed', 'Failed to load billing plans.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    // Cleanup
    return () => {
      setPlans([]);
      setSelectedPlanId(currentPlanId);
      setError(null);
    };
  }, [visible, currentPlanId, t]);

  // Submit plan change
  const handleSubmit = async () => {
    if (!selectedPlanId || selectedPlanId === currentPlanId) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // const PartnerService = (await import('../../../services/PartnerService'))
      //   .default;
      const response = await PartnerService.switchBillingPlan(selectedPlanId);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: t('billing.planSwitcher.planSwitched', 'Plan switched!'),
          text2: t('billing.planSwitcher.planUpdated', 'Your billing plan has been updated.'),
        });
        onPlanSwitched();
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || t('billing.planSwitcher.switchFailed', 'Failed to switch plan.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none" // Remove default animation
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal
      supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.container}>
        {/* Animated Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
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
            styles.modalContainer,
            {
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.iconTitleRow}>
            <GetIcon iconName="bill" size={24} color="#6366f1" />
            <Text style={styles.modalTitle}>{t('billing.planSwitcher.title', 'Switch Billing Plan')}</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme.primaryColor}
              style={styles.spinnerMargin}
            />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView style={styles.planListScroll}>
              {plans.map(plan => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planItem,
                    selectedPlanId === plan.id && styles.selectedPlanItem,
                  ]}
                  onPress={() => setSelectedPlanId(plan.id)}
                  disabled={submitting}
                  accessibilityLabel={t('billing.planSwitcher.selectPlan', 'Select {{planName}} plan', { planName: plan.planName })}>
                  <View style={styles.planHeader}>
                    <View style={styles.radioCircle}>
                      {selectedPlanId === plan.id && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                    <Text style={styles.planName}>{plan.planName}</Text>
                  </View>
                  <Text style={styles.planPrice}>
                    {formatCurrency(convertPaiseToRupees(plan.price, currentLanguage), currentLanguage)}
                  </Text>
                  <View style={styles.featuresList}>
                    <Text style={styles.featureText}>
                      • {t('billing.planSwitcher.maxUsers', 'Max Users:')} {plan.maxUsers}
                    </Text>
                    <Text style={styles.featureText}>
                      • {t('billing.nextBill.duration', 'Duration:')} {plan.durationDays} {t('billing.nextBill.days', 'days')}
                    </Text>
                    <Text style={styles.featureText}>
                      • {t('billing.nextBill.billingCycle', 'Billing Cycle:')} {plan.billingCycle}
                    </Text>
                    {plan.isTrial && (
                      <Text style={styles.featureText}>• {t('billing.planSwitcher.trialPlan', 'Trial Plan')}</Text>
                    )}
                    {plan.description && (
                      <Text style={styles.featureText}>
                        • {plan.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting || selectedPlanId === currentPlanId
                ? styles.disabledButton
                : {backgroundColor: theme.primaryColor},
            ]}
            onPress={handleSubmit}
            disabled={submitting || selectedPlanId === currentPlanId}
            accessibilityLabel={t('billing.planSwitcher.submitChange', 'Submit plan change')}>
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('billing.planSwitcher.switchPlan', 'Switch Plan')}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  planItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  selectedPlanItem: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  featuresList: {
    marginTop: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    opacity: 0.7,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  iconTitleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  iconMargin: {
    marginRight: 8,
  },
  spinnerMargin: {
    marginVertical: 32,
  },
  planListScroll: {
    maxHeight: 320,
  },
});

export default BillingPlanSwitcherModal;
