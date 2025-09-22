import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {formatCompactPrice} from '../../../utils/currency';
import {InsightCard} from './InsightCard';
import {SellerProperty} from '../../../types';
import {useTranslation} from 'react-i18next';

interface RecentActivityProps {
  recentProperties: SellerProperty[];
  onPropertyPress: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  recentProperties,
  onPropertyPress,
}) => {
  const {t} = useTranslation();
  if (recentProperties.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('seller.dashboard.recentActivity')}
      </Text>
      <InsightCard style={styles.whiteCard}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <GetIcon iconName="time" color="white" size="20" />
          </View>
          <Text style={styles.headerTitle}>
            {t('seller.analytics.latestProperties')}
          </Text>
        </View>
        <View style={styles.list}>
          {recentProperties.slice(0, 3).map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyItem}
              onPress={onPropertyPress}
              activeOpacity={0.7}>
              <View style={styles.propertyIconContainer}>
                <GetIcon iconName="home" color={Colors.MT_PRIMARY_1} size="18" />
              </View>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName} numberOfLines={1}>
                  {property.propertyName}
                </Text>
                <View style={styles.propertyDetailsContainer}>
                  <Text style={styles.propertyLocation} numberOfLines={1}>
                    {property.location}
                  </Text>
                  <Text style={styles.propertyDateTime}>
                    {new Date(property.createdOn).toLocaleDateString()} {new Date(property.createdOn).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.propertyPrice}>
                {formatCompactPrice(property.price)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </InsightCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#EF4444',
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
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  propertyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.MT_PRIMARY_1}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  propertyDetails: {
    fontSize: 11,
    color: '#6B7280',
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
  },
  propertyDetailsContainer: {
    flex: 1,
  },
  propertyLocation: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  propertyDateTime: {
    fontSize: 11,
    color: '#6B7280',
  },
});
