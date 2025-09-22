import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {InsightCard} from './InsightCard';
import {useTranslation} from 'react-i18next';

type LocationInsights = [string, number][];

interface ReadyToMoveStatsData {
  readyToMove: number;
  underConstruction: number;
  readyPercentage: number;
}

interface LocationStatusProps {
  locationInsights: LocationInsights | null;
  readyToMoveStats: ReadyToMoveStatsData | null;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({
  locationInsights,
  readyToMoveStats,
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('seller.dashboard.locationStatus')}
      </Text>

      <View style={styles.sectionsContainer}>
        {/* Top Locations */}
        <InsightCard style={styles.whiteCard}>
          <View style={styles.header}>
            <View style={styles.locationIconContainer}>
              <GetIcon iconName="locationPin" color="white" size="20" />
            </View>
            <Text style={styles.headerTitle}>
              {t('seller.analytics.topLocations')}
            </Text>
          </View>
          {locationInsights && locationInsights.length > 0 ? (
            <View style={styles.list}>
              {locationInsights.slice(0, 3).map(([location, count], index) => (
                <View key={location} style={styles.locationItem}>
                  <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName} numberOfLines={1}>
                      {location}
                    </Text>
                    <Text style={styles.locationCount}>
                      {count} {t('seller.status.properties')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <GetIcon iconName="locationPin" color={Colors.MT_SECONDARY_2} size="20" />
              <Text style={styles.emptyText}>
                {t('seller.status.noLocationData')}
              </Text>
            </View>
          )}
        </InsightCard>

        {/* Property Status */}
        <InsightCard style={styles.whiteCard}>
          <View style={styles.header}>
            <View style={styles.statusIconContainer}>
              <GetIcon iconName="time" color="white" size="20" />
            </View>
            <Text style={styles.headerTitle}>
              {t('seller.status.propertyStatus')}
            </Text>
          </View>
          {readyToMoveStats ? (
            <View style={styles.list}>
              <View style={styles.statusItem}>
                <View style={styles.readyIndicator} />
                <Text style={styles.statusLabel}>
                  {t('seller.status.ready')}
                </Text>
                <Text style={styles.statusCount}>
                  {readyToMoveStats.readyToMove}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <View style={styles.constructionIndicator} />
                <Text style={styles.statusLabel}>
                  {t('seller.status.construction')}
                </Text>
                <Text style={styles.statusCount}>
                  {readyToMoveStats.underConstruction}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <GetIcon iconName="time" color={Colors.MT_SECONDARY_2} size="20" />
              <Text style={styles.emptyText}>
                {t('seller.status.noStatusData')}
              </Text>
            </View>
          )}
        </InsightCard>
      </View>
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
  sectionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  whiteCard: {
    backgroundColor: 'white',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
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
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#10B981',
  },
  rankText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  locationCount: {
    fontSize: 11,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#10B981',
  },
  constructionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#F59E0B',
  },
  statusLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  statusCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_PRIMARY_1,
  },
});
