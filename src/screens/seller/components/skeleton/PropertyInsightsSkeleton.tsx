import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton, SkeletonCard} from '../Skeleton';

export const PropertyInsightsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={180} height={24} style={styles.titleSkeleton} />

    {/* Property Types Skeleton */}
    <SkeletonCard>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={120} height={16} style={styles.headerTitle} />
      </View>
      <View style={styles.list}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Skeleton width={12} height={12} borderRadius={6} />
            <Skeleton width={80} height={14} style={styles.itemName} />
          </View>
          <View style={styles.itemRight}>
            <Skeleton width={30} height={16} />
            <Skeleton width={25} height={11} />
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Skeleton width={12} height={12} borderRadius={6} />
            <Skeleton width={80} height={14} style={styles.itemName} />
          </View>
          <View style={styles.itemRight}>
            <Skeleton width={30} height={16} />
            <Skeleton width={25} height={11} />
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Skeleton width={12} height={12} borderRadius={6} />
            <Skeleton width={80} height={14} style={styles.itemName} />
          </View>
          <View style={styles.itemRight}>
            <Skeleton width={30} height={16} />
            <Skeleton width={25} height={11} />
          </View>
        </View>
      </View>
    </SkeletonCard>

    {/* BHK Configuration Skeleton */}
    <SkeletonCard>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={140} height={16} style={styles.headerTitle} />
      </View>
      <View style={styles.list}>
        <View style={styles.bhkItem}>
          <Skeleton width={60} height={14} />
          <View style={styles.progressContainer}>
            <Skeleton width="100%" height={6} borderRadius={3} />
            <Skeleton width={30} height={14} style={styles.bhkCount} />
          </View>
        </View>
        <View style={styles.bhkItem}>
          <Skeleton width={60} height={14} />
          <View style={styles.progressContainer}>
            <Skeleton width="100%" height={6} borderRadius={3} />
            <Skeleton width={30} height={14} style={styles.bhkCount} />
          </View>
        </View>
        <View style={styles.bhkItem}>
          <Skeleton width={60} height={14} />
          <View style={styles.progressContainer}>
            <Skeleton width="100%" height={6} borderRadius={3} />
            <Skeleton width={30} height={14} style={styles.bhkCount} />
          </View>
        </View>
      </View>
    </SkeletonCard>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    marginLeft: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  bhkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  bhkCount: {
    marginLeft: 12,
  },
});
