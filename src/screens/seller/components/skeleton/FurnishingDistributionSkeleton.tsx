import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const FurnishingDistributionSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={200} height={24} style={styles.titleSkeleton} />

    <SkeletonCard>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={180} height={16} style={styles.headerTitle} />
      </View>
      <View style={styles.list}>
        <View style={styles.furnishingItem}>
          <View style={styles.furnishingLeft}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={80} height={14} style={styles.furnishingName} />
          </View>
          <Skeleton width={30} height={14} />
        </View>
        <View style={styles.furnishingItem}>
          <View style={styles.furnishingLeft}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={80} height={14} style={styles.furnishingName} />
          </View>
          <Skeleton width={30} height={14} />
        </View>
        <View style={styles.furnishingItem}>
          <View style={styles.furnishingLeft}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={80} height={14} style={styles.furnishingName} />
          </View>
          <Skeleton width={30} height={14} />
        </View>
      </View>
    </SkeletonCard>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  titleSkeleton: {
    marginBottom: 16,
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
  furnishingName: {
    marginLeft: 12,
  },
});
