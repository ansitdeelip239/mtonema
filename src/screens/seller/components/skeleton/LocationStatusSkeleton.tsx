import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const LocationStatusSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={160} height={24} style={styles.titleSkeleton} />

    <View style={styles.sectionsContainer}>
      {/* Top Locations Skeleton */}
      <SkeletonCard>
        <View style={styles.header}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} style={styles.headerTitle} />
        </View>
        <View style={styles.list}>
          <View style={styles.locationItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <View style={styles.locationInfo}>
              <Skeleton width={100} height={13} style={styles.locationName} />
              <Skeleton width={70} height={11} />
            </View>
          </View>
          <View style={styles.locationItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <View style={styles.locationInfo}>
              <Skeleton width={100} height={13} style={styles.locationName} />
              <Skeleton width={70} height={11} />
            </View>
          </View>
          <View style={styles.locationItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <View style={styles.locationInfo}>
              <Skeleton width={100} height={13} style={styles.locationName} />
              <Skeleton width={70} height={11} />
            </View>
          </View>
        </View>
      </SkeletonCard>

      {/* Property Status Skeleton */}
      <SkeletonCard>
        <View style={styles.header}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={130} height={16} style={styles.headerTitle} />
        </View>
        <View style={styles.list}>
          <View style={styles.statusItem}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={60} height={13} style={styles.statusLabel} />
            <Skeleton width={30} height={14} />
          </View>
          <View style={styles.statusItem}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={60} height={13} style={styles.statusLabel} />
            <Skeleton width={30} height={14} />
          </View>
        </View>
      </SkeletonCard>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  titleSkeleton: {
    marginBottom: 16,
  },
  sectionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    marginLeft: 12,
  },
  list: {
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    marginBottom: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    marginLeft: 8,
    flex: 1,
  },
});
