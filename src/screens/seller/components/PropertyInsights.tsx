import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {InsightCard} from './InsightCard';
import {SellerProperty} from '../../../types';

type PropertyTypeAnalytics = [string, number][];
type BHKAnalytics = [string, number][];

interface PropertyInsightsProps {
  propertyTypeAnalytics: PropertyTypeAnalytics | null;
  bhkAnalytics: BHKAnalytics | null;
  properties: SellerProperty[];
}

export const PropertyInsights: React.FC<PropertyInsightsProps> = ({
  propertyTypeAnalytics,
  bhkAnalytics,
  properties,
}) => {
  const getPropertyTypeColor = (index: number): string => {
    return index === 0 ? '#10B981' : index === 1 ? '#F59E0B' : '#8B5CF6';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Property Insights
      </Text>

      {/* Property Types */}
      {propertyTypeAnalytics && propertyTypeAnalytics.length > 0 && (
        <InsightCard style={styles.whiteCard}>
          <View style={styles.header}>
            <View style={styles.propertyTypeIconContainer}>
              <GetIcon iconName="realEstate" color="white" size="20" />
            </View>
            <Text style={styles.headerTitle}>
              Property Types
            </Text>
          </View>
          <View style={styles.list}>
            {propertyTypeAnalytics.slice(0, 3).map(([type, count], index) => (
              <View key={type} style={styles.propertyTypeItem}>
                <View style={styles.propertyTypeLeft}>
                  <View style={[styles.colorIndicator, {backgroundColor: getPropertyTypeColor(index)}]} />
                  <Text style={styles.propertyTypeName}>
                    {type}
                  </Text>
                </View>
                <View style={styles.propertyTypeRight}>
                  <Text style={styles.propertyTypeCount}>
                    {count}
                  </Text>
                  <Text style={styles.propertyTypePercentage}>
                    {Math.round((count / properties.length) * 100)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </InsightCard>
      )}

      {/* BHK Configuration */}
      {bhkAnalytics && bhkAnalytics.length > 0 && (
        <InsightCard style={styles.whiteCard}>
          <View style={styles.header}>
            <View style={styles.bhkIconContainer}>
              <GetIcon iconName="home" color="white" size="20" />
            </View>
            <Text style={styles.headerTitle}>
              BHK Configuration
            </Text>
          </View>
          <View style={styles.list}>
            {bhkAnalytics.map(([bhk, count]) => (
              <View key={bhk} style={styles.bhkItem}>
                <Text style={styles.bhkLabel}>
                  {bhk}
                </Text>
                <View style={styles.bhkProgressContainer}>
                  <View style={styles.bhkProgressBar}>
                    <View style={[styles.bhkProgressFill, {width: `${(count / properties.length) * 100}%`}]} />
                  </View>
                  <Text style={styles.bhkCount}>
                    {count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </InsightCard>
      )}
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
  whiteCard: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  propertyTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bhkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
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
  propertyTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  propertyTypeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  propertyTypeRight: {
    alignItems: 'flex-end',
  },
  propertyTypeCount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
  },
  propertyTypePercentage: {
    fontSize: 11,
    color: '#6B7280',
  },
  bhkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bhkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 80,
  },
  bhkProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  bhkProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 12,
  },
  bhkProgressFill: {
    height: '100%',
    backgroundColor: Colors.MT_PRIMARY_1,
    borderRadius: 3,
  },
  bhkCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
    minWidth: 30,
    textAlign: 'right',
  },
});
