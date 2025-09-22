import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import {formatCurrency} from '../../../utils/currency';
import {InsightCard} from './InsightCard';
import {useTranslation} from 'react-i18next';

interface PriceAnalyticsData {
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
}

interface PriceAnalyticsProps {
  priceAnalytics: PriceAnalyticsData | null;
}

export const PriceAnalytics: React.FC<PriceAnalyticsProps> = ({priceAnalytics}) => {
  const {t} = useTranslation();
  if (!priceAnalytics) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('seller.dashboard.priceAnalytics')}
      </Text>
      <InsightCard>
        <View style={styles.content}>
          <View style={styles.metricContainer}>
            <View style={styles.averageIconContainer}>
              <GetIcon iconName="rupee" color="#3B82F6" size="16" />
            </View>
            <Text style={styles.metricLabel}>
              {t('seller.analytics.average')}
            </Text>
            <Text style={styles.metricValue} numberOfLines={1}>
              {formatCurrency(priceAnalytics.avgPrice)}
            </Text>
          </View>
          <View style={styles.metricContainer}>
            <View style={styles.highestIconContainer}>
              <GetIcon iconName="ascending" color="#10B981" size="16" />
            </View>
            <Text style={styles.metricLabel}>
              {t('seller.analytics.highest')}
            </Text>
            <Text style={styles.metricValue} numberOfLines={1}>
              {formatCurrency(priceAnalytics.maxPrice)}
            </Text>
          </View>
          <View style={styles.metricContainer}>
            <View style={styles.lowestIconContainer}>
              <GetIcon iconName="descending" color="#F59E0B" size="16" />
            </View>
            <Text style={styles.metricLabel}>
              {t('seller.analytics.lowest')}
            </Text>
            <Text style={styles.metricValue} numberOfLines={1}>
              {formatCurrency(priceAnalytics.minPrice)}
            </Text>
          </View>
        </View>
      </InsightCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricContainer: {
    alignItems: 'center',
    flex: 1,
  },
  averageIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#EFF6FF',
  },
  highestIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#F0FDF4',
  },
  lowestIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#FEF3C7',
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
});
