import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {formatPortfolioValue} from '../../../utils/currency';
import {InsightCard} from './InsightCard';
import { StatCard } from './StatCard';
import {SellerProperty} from '../../../types';

interface MonthlyInsights {
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface PortfolioOverviewProps {
  properties: SellerProperty[];
  totalCount: number;
  activeProperties: number;
  featuredProperties: number;
  monthlyInsights: MonthlyInsights | null;
  portfolioValue: number;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  properties,
  totalCount,
  activeProperties,
  featuredProperties,
  monthlyInsights,
  portfolioValue,
}) => {
  if (properties.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.sectionTitle}>
          Portfolio Overview
        </Text>
        <InsightCard>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIconContainer}>
              <GetIcon iconName="realEstate" color={Colors.MT_SECONDARY_2} size="32" />
            </View>
            <Text style={styles.emptyTitle}>
              No Properties Yet
            </Text>
            <Text style={styles.emptySubtitle}>
              Start building your portfolio by adding your first property
            </Text>
          </View>
        </InsightCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Portfolio Overview
      </Text>

      {/* Portfolio Value Card */}
      <InsightCard style={styles.portfolioCard}>
        <View style={styles.portfolioContent}>
          <View style={styles.portfolioIconContainer}>
            <GetIcon iconName="home" color="white" size="24" />
          </View>
          <View style={styles.portfolioTextContainer}>
            <Text style={styles.portfolioValue}>
              {formatPortfolioValue(portfolioValue)}
            </Text>
            <Text style={styles.portfolioLabel}>
              Total Portfolio Value
            </Text>
            <Text style={styles.portfolioSubLabel}>
              {totalCount} Properties
            </Text>
          </View>
        </View>
      </InsightCard>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="checkmark"
          value={activeProperties}
          label="Active"
          color="#10B981"
          bgColor="#F0FDF4"
        />
        <StatCard
          icon="premium"
          value={featuredProperties}
          label="Featured"
          color="#F59E0B"
          bgColor="#FFFBEB"
        />
        <StatCard
          icon="calendar"
          value={monthlyInsights?.thisMonth || 0}
          label="This Month"
          color="#8B5CF6"
          bgColor="#FAF5FF"
        />
        <StatCard
          icon="growth"
          value={`${monthlyInsights?.growth && monthlyInsights.growth >= 0 ? '+' : ''}${monthlyInsights?.growth || 0}%`}
          label="Growth"
          color={monthlyInsights?.growth ? (monthlyInsights.growth >= 0 ? '#10B981' : '#EF4444') : '#6B7280'}
          bgColor={monthlyInsights?.growth ? (monthlyInsights.growth >= 0 ? '#F0FDF4' : '#FEF2F2') : '#F9FAFB'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  portfolioCard: {
    backgroundColor: '#6366f1',
  },
  portfolioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  portfolioValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  portfolioLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  portfolioSubLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
