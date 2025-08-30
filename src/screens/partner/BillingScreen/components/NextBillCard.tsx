import React from 'react';
import {NextBillResponse} from '../../../../types/payment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {formatCurrency} from '../../../../utils/currency';
import {formatLocalizedDate, formatLocalizedNumber} from '../../../../utils/dateUtils';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';

export const NextBillCard = React.memo(
  ({
    nextBill,
    onPayNow,
  }: {
    nextBill: NextBillResponse['nextBill'];
    onPayNow: () => void;
  }) => {
    const { t } = useTranslation();
    const currentLanguage = i18n.language;

    // Get translated billing cycle value
    const getTranslatedBillingCycle = (billingCycle: string) => {
      return t(`billing.nextBill.billingCycleValues.${billingCycle}`, billingCycle);
    };

    return (
    <View style={styles.billCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <GetIcon iconName="bill" size={24} color="#6366f1" />
          <Text style={styles.cardTitle}>{t('billing.nextBill.title', 'Next Bill')}</Text>
        </View>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>
            {formatCurrency(nextBill.amount, currentLanguage)}
          </Text>
        </View>
      </View>

      <View style={styles.billDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('billing.nextBill.billingCycle', 'Billing Cycle')}</Text>
            <Text style={styles.detailValue}>{getTranslatedBillingCycle(nextBill.billingCycle)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('billing.nextBill.duration', 'Duration')}</Text>
            <Text style={styles.detailValue}>{formatLocalizedNumber(nextBill.durationDays, currentLanguage)} {t('billing.nextBill.days', 'days')}</Text>
          </View>
        </View>

        <View style={styles.periodInfo}>
          <Text style={styles.detailLabel}>{t('billing.nextBill.billingPeriod', 'Billing Period')}</Text>
          <Text style={styles.periodText}>
            {formatLocalizedDate(nextBill.startDate, currentLanguage)} -{' '}
            {formatLocalizedDate(nextBill.endDate, currentLanguage)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={onPayNow}>
        <GetIcon iconName="rupee" size={20} color="white" />
        <Text style={styles.payButtonText}>{t('billing.nextBill.payNow', 'Pay Now')}</Text>
      </TouchableOpacity>
    </View>
    );
  },
);

const styles = StyleSheet.create({
  billCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  amountBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  billDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  periodInfo: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  periodText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
