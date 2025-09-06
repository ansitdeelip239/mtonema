// @ts-nocheck
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {InsightCard} from './InsightCard';
import {SellerProperty} from '../../../types';

type FurnishingStats = [string, number][];

interface FurnishingDistributionProps {
  furnishingStats: FurnishingStats | null;
  properties: SellerProperty[];
}

export const FurnishingDistribution: React.FC<FurnishingDistributionProps> = ({
  furnishingStats,
  properties,
}) => {
  if (!furnishingStats || furnishingStats.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Furnishing Distribution
      </Text>
      <InsightCard style={styles.whiteCard}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <GetIcon iconName="home" color="white" size="20" />
          </View>
          <Text style={styles.headerTitle}>
            Furnishing Distribution
          </Text>
        </View>
        <View style={styles.list}>
          {furnishingStats.map(([furnishing, count]) => (
            <View key={furnishing} style={styles.furnishingItem}>
              <View style={styles.furnishingLeft}>
                <View style={styles.colorIndicator} />
                <Text style={styles.furnishingName}>
                  {furnishing}
                </Text>
              </View>
              <Text style={styles.furnishingPercentage}>
                {Math.round((count / properties.length) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      </InsightCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  whiteCard: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  list: {
    gap: 12,
  },
  furnishingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  furnishingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.MT_PRIMARY_1,
    marginRight: 12,
  },
  furnishingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  furnishingPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
  },
});
