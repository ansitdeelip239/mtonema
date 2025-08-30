import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {NextBillResponse} from '../../../../types/payment';
import { convertPaiseToRupees } from '../../../../utils/currency';
import {formatLocalizedDate} from '../../../../utils/dateUtils';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import TransactionStatus from '../../../../constants/TransactionStatus';

interface PaymentHistoryProps {
  paymentHistory: NextBillResponse['transactionHistory'];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  paymentHistory,
}) => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  if (!paymentHistory || paymentHistory.length === 0) {
    return null;
  }

  return (
    <View style={styles.historySection}>
      <View style={styles.sectionHeader}>
        <GetIcon iconName="time" size={20} color="#6b7280" />
        <Text style={styles.sectionTitle}>{t('billing.paymentHistory.title', 'Payment History')}</Text>
      </View>
      {paymentHistory.map((txn, index) => (
        <View
          key={txn.id}
          style={[
            styles.historyItem,
            index === paymentHistory.length - 1 && styles.lastHistoryItem,
          ]}>
          <View style={styles.historyLeft}>
            <View
              style={[
                styles.statusIndicator,
                txn.statusName === TransactionStatus.CAPTURED
                  ? styles.successIndicator
                  : styles.failureIndicator,
              ]}
            />
            <View style={styles.historyInfo}>
              <Text style={styles.historyDate}>
                {formatLocalizedDate(txn.transactionDate, currentLanguage)}
              </Text>
              <Text
                style={[
                  styles.historyStatus,
                  txn.statusName === TransactionStatus.CAPTURED
                    ? styles.successStatus
                    : styles.failureStatus,
                ]}>
                {txn.statusName === TransactionStatus.CAPTURED
                  ? t('billing.paymentHistory.status.success', 'Success')
                  : t('billing.paymentHistory.status.failed', 'Failed')}
              </Text>
            </View>
          </View>
          <Text style={styles.historyAmount}>
            {convertPaiseToRupees(txn.amount, currentLanguage)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastHistoryItem: {
    borderBottomWidth: 0,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  successIndicator: {
    backgroundColor: '#10b981',
  },
  failureIndicator: {
    backgroundColor: '#ef4444',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  successStatus: {
    color: '#10b981',
  },
  failureStatus: {
    color: '#ef4444',
  },
  historyAmount: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
});

export default PaymentHistory;
