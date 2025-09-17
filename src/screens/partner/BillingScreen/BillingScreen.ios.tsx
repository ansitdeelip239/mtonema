import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PartnerService from '../../../services/PartnerService';
import {NextBillResponse} from '../../../types/payment';
import PaymentHistory from './components/PaymentHistory';
import SwitchAccountButton from '../../../components/SwitchAccountButton';
import {LoadingComponent} from './components/LoadingComponent';
import {ErrorComponent} from './components/ErrorComponent';
import {NextBillCard} from './components/NextBillCard';
import BillingPlanSwitcherModal from './components/BillingPlanSwitcherModal';
import GetIcon from '../../../components/GetIcon';
import { useTranslation } from 'react-i18next';

type Props = {
  onPaymentSuccess?: () => void;
};

const BillingScreen: React.FC<Props> = ({onPaymentSuccess: _onPaymentSuccess}) => {
  const [state, setState] = useState({
    loading: true,
    error: null as string | null,
  });

  const [nextBill, setNextBill] = useState<NextBillResponse['nextBill'] | null>(
    null,
  );
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<
    NextBillResponse['transactionHistory']
  >([]);

  // const {theme} = useTheme(); // Not used in iOS version
  const { t } = useTranslation();

  const fetchNextBill = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));
    try {
      const response = await PartnerService.getNextBill();
      setNextBill(response.data.nextBill);
      setPaymentHistory(response.data.transactionHistory);
    } catch (err) {
      setState(prev => ({...prev, error: t('billing.errors.loadFailed', 'Failed to load billing info.')}));
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  }, [t]);

  const handleWebsitePayment = () => {
    Alert.alert(
      'Complete on Web Platform',
      'Full account and billing management features are available on our complete platform for comprehensive control.',
      [{text: 'OK'}],
    );
  };

  useEffect(() => {
    fetchNextBill();
  }, [fetchNextBill]);

  // Early returns for better performance
  if (state.loading) {
    return <LoadingComponent />;
  }
  if (state.error) {
    return <ErrorComponent error={state.error} onRetry={fetchNextBill} />;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
        <SwitchAccountButton />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{t('billing.title', 'Billing & Payments')}</Text>
            <Text style={styles.subtitle}>
              {t('billing.subtitle', 'Manage your subscription and payment history')}
            </Text>
          </View>
        </View>

        {/* Switch Billing Plan Button */}
        <TouchableOpacity
          style={styles.switchPlanButton}
          onPress={() => setShowPlanModal(true)}
          accessibilityLabel="Switch Billing Plan"
        >
          <Text style={styles.switchPlanButtonText}>{t('billing.switchPlanButton', 'Switch Billing Plan')}</Text>
        </TouchableOpacity>

        {nextBill && (
          <View style={styles.nextBillContainer}>
            <NextBillCard nextBill={nextBill} onPayNow={handleWebsitePayment} />

            {/* iOS Payment Notice */}
            <View style={styles.iosPaymentNotice}>
              <GetIcon iconName="about" size={24} color="#666" />
              <Text style={styles.iosPaymentTitle}>Web Platform Required</Text>
              <Text style={styles.iosPaymentText}>
                Complete billing management tools are available on our full platform.
                Use the button above to access comprehensive account features.
              </Text>
            </View>
          </View>
        )}

        <PaymentHistory paymentHistory={paymentHistory} />

        {/* Billing Plan Switcher Modal */}
        <BillingPlanSwitcherModal
          visible={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          currentPlanId={nextBill ? nextBill.partner.plan.id : 0}
          onPlanSwitched={fetchNextBill}
        />
      </ScrollView>
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    margin: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  switchPlanButton: {
    marginBottom: 16,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  switchPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBillContainer: {
    marginBottom: 20,
  },
  iosPaymentNotice: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iosPaymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  iosPaymentText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(BillingScreen);